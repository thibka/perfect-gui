//#region src/components/Button.ts
var e = class {
	constructor(e, t = {}) {
		if (this.callback = null, this.parent = e, typeof t != "object") throw Error(`[GUI] button() first parameter must be an object. Received: ${typeof t}.`);
		let n = t.label || "\xA0", r = typeof t.tooltip == "string" ? t.tooltip : t.tooltip === !0 ? n : null, i = document.createElement("div");
		i.className = "p-gui__button", i.textContent = n, i.setAttribute("role", "button"), i.setAttribute("tabindex", "0"), r && i.setAttribute("title", r);
		let a = () => {
			this.callback && this.callback(), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		};
		i.addEventListener("click", a), i.addEventListener("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), a());
		}), typeof t.color == "string" && (i.style.setProperty("--color-accent", t.color), i.style.setProperty("--color-accent-hover", t.hoverColor || t.color)), this.parent.wrapper.append(i), this.element = i;
	}
	onClick(e) {
		return this.callback = e, this;
	}
}, t = /* @__PURE__ */ new WeakMap();
function n(e, n) {
	let r = t.get(e);
	r || (r = /* @__PURE__ */ new Map(), t.set(e, r));
	let i = r.get(n);
	return i || (i = {
		value: e[n],
		listeners: /* @__PURE__ */ new Set()
	}, r.set(n, i), Object.defineProperty(e, n, {
		configurable: !0,
		get: () => i.value,
		set: (e) => {
			i.value = e, i.listeners.forEach((t) => t(e));
		}
	})), i;
}
//#endregion
//#region src/components/Slider.ts
var r = class {
	constructor(e, t, r, i = {}) {
		if (this.callback = null, this.parent = e, t && typeof t == "object" && typeof r == "string") this.obj = t, this.prop = r;
		else throw Error("[GUI] slider() invalid parameters.");
		this.isReadonly = !!i.readonly;
		let a = typeof i.label == "string" && i.label || "\xA0";
		a == "\xA0" && (a = this.prop), this.min = i.min ?? 0, this.max = i.max ?? 1, this.step = i.step || (this.max - this.min) / 100, this.decimals = this.parent._countDecimals(this.step);
		let o = n(this.obj, this.prop), s = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? a : null, c = document.createElement("div");
		c.className = "p-gui__slider", s && c.setAttribute("title", s), this.isReadonly && c.setAttribute("data-readonly", "true"), this.parent.wrapper.append(c), this.element = c;
		let l = document.createElement("div");
		l.className = "p-gui__slider-name", l.textContent = a, c.append(l), this.ctrlDiv = document.createElement("div"), this.ctrlDiv.prevPosition = 0, this.ctrlDiv.className = "p-gui__slider-ctrl", this.ctrlDiv.setAttribute("role", "slider"), this.ctrlDiv.setAttribute("tabindex", this.isReadonly ? "-1" : "0"), this.ctrlDiv.setAttribute("aria-label", a), this.isReadonly && this.ctrlDiv.setAttribute("aria-readonly", "true"), this.ctrlDiv.setAttribute("aria-valuemin", String(this.min)), this.ctrlDiv.setAttribute("aria-valuemax", String(this.max)), c.append(this.ctrlDiv);
		let u = document.createElement("div");
		u.className = "p-gui__slider-bar", this.ctrlDiv.append(u), this.handle = document.createElement("div"), this.handle.className = "p-gui__slider-handle", this.ctrlDiv.append(this.handle), this.filling = document.createElement("div"), this.filling.className = "p-gui__slider-filling", u.append(this.filling), this.valueInput = document.createElement("input"), this.valueInput.className = "p-gui__slider-value", this.valueInput.value = this.obj[this.prop], this.valueInput.setAttribute("aria-label", a), this.isReadonly && (this.valueInput.readOnly = !0, this.valueInput.tabIndex = -1), c.append(this.valueInput), this._updateHandlePositionFromValue(), new ResizeObserver(() => {
			this._updateHandlePositionFromValue();
		}).observe(this.ctrlDiv), this.valueInput.addEventListener("change", () => {
			this.isReadonly || (this._updateHandlePositionFromValue(), this._triggerCallbacks());
		}), this.ctrlDiv.addEventListener("pointerdown", (e) => {
			this.isReadonly || (this.ctrlDiv.pointerDown = !0, this.ctrlDiv.prevPosition = e.clientX, this._updateHandlePositionFromPointer(e, !0));
		}), window.addEventListener("pointerup", () => {
			this.ctrlDiv.pointerDown = !1;
		}), window.addEventListener("pointercancel", () => {
			this.ctrlDiv.pointerDown = !1;
		}), window.addEventListener("pointermove", (e) => {
			this.ctrlDiv.pointerDown && (this.ctrlDiv.pointerDelta = e.clientX - (this.ctrlDiv.prevPosition ?? 0), this._updateHandlePositionFromPointer(e));
		}), this.ctrlDiv.addEventListener("keydown", (e) => {
			if (this.isReadonly) return;
			let t = 0;
			if (e.key === "ArrowRight" || e.key === "ArrowUp") t = this.step;
			else if (e.key === "ArrowLeft" || e.key === "ArrowDown") t = -this.step;
			else if (e.key === "PageUp") t = this.step * 10;
			else if (e.key === "PageDown") t = -this.step * 10;
			else if (e.key === "Home") {
				this._setValue(this.min), e.preventDefault();
				return;
			} else if (e.key === "End") {
				this._setValue(this.max), e.preventDefault();
				return;
			} else return;
			e.preventDefault(), this._setValue(parseFloat(this.valueInput.value) + t);
		}), o.listeners.add((e) => {
			this.valueInput.value = String(e), this._updateHandlePositionFromValue(), this.callback && this.callback(parseFloat(this.valueInput.value));
		});
	}
	_updateHandlePositionFromPointer(e, t = !1) {
		let n = this.ctrlDiv.getBoundingClientRect(), r = n.width, i = this.handle.offsetWidth, a = e.clientX - (this.ctrlDiv.prevPosition ?? 0), o = parseFloat(this.valueInput.value), s;
		s = t ? e.clientX - n.left : (this.handle.position ?? 0) + a, s = Math.max(i / 2, Math.min(s, r - i / 2));
		let c = this.min + (this.max - this.min) * (s - i / 2) / (r - i);
		c = c > o ? this._quantizeFloor(c, this.step) : this._quantizeCeil(c, this.step), c = parseFloat(c.toFixed(9));
		let l = parseFloat((o + this.step).toFixed(9)), u = parseFloat((o - this.step).toFixed(9));
		(c >= l || c <= u) && (c = parseFloat(c.toFixed(this.decimals)), this.valueInput.value = String(c), this.ctrlDiv.prevPosition = e.clientX, this.handle.style.transform = `translate(-50%, -50%) translateX(${s}px)`, this.handle.position = s, this.filling.style.width = this.handle.position + "px", this._updateAriaValue(), this._triggerCallbacks());
	}
	_setValue(e) {
		e = Math.max(this.min, Math.min(this.max, e)), e = parseFloat(e.toFixed(this.decimals)), this.valueInput.value = String(e), this._updateHandlePositionFromValue(), this._triggerCallbacks();
	}
	_updateAriaValue() {
		this.ctrlDiv.setAttribute("aria-valuenow", this.valueInput.value);
	}
	_updateHandlePositionFromValue() {
		let e = this.ctrlDiv.offsetWidth, t = this.handle.offsetWidth, n = this.parent._mapLinear(parseFloat(this.valueInput.value), this.min, this.max, t / 2, e - t / 2);
		n = Math.max(t / 2, Math.min(n, e - t / 2)), this.handle.style.transform = `translate(-50%, -50%) translateX(${n}px)`, this.handle.position = n, this.filling.style.width = this.handle.position + "px", this._updateAriaValue();
	}
	_triggerCallbacks() {
		this.obj[this.prop] = parseFloat(this.valueInput.value), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
	}
	_quantize(e, t) {
		return t * Math.round(e / t);
	}
	_quantizeCeil(e, t) {
		return t * Math.ceil(e / t);
	}
	_quantizeFloor(e, t) {
		return t * Math.floor(e / t);
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, i = class {
	constructor(e, t, n = {}) {
		if (this.callback = null, this.parent = e, t === void 0) throw Error("[GUI] image() path must be provided.");
		if (typeof t != "string") throw Error("[GUI] image() path must be a string.");
		if (typeof n != "object") throw Error(`[GUI] image() second parameter must be an object. Received: ${typeof n}.`);
		let r = t.replace(/^.*[\\\/]/, ""), i;
		i = n.label == null ? r : typeof n.label == "string" && n.label || "\xA0";
		let a = typeof n.tooltip == "string" ? n.tooltip : n.tooltip === !0 ? i : null, o = n.selected === !0, s = n.selectionBorder !== !1, c = "";
		if (n.width) {
			let e = n.width;
			typeof e == "number" && (e = `${e}px`), c += `flex: 0 0 calc(${e} - 5px); `;
		}
		if (n.height) {
			let e = n.height;
			typeof e == "number" && (e = `${e}px`), c += `height: ${e}; `;
		}
		let l = document.createElement("div");
		l.className = "p-gui__image", l.style = "background-image: url(" + t + "); " + c, l.setAttribute("role", "button"), l.setAttribute("tabindex", "0"), l.setAttribute("aria-label", i), l.setAttribute("aria-pressed", String(o)), a && l.setAttribute("title", a), this.parent.imageContainer.append(l), this.element = l, o && s && l.classList.add("p-gui__image--selected");
		let u = document.createElement("div");
		u.className = "p-gui__image-text", u.textContent = i, l.append(u);
		let d = () => {
			let e = l.parentElement?.querySelectorAll(".p-gui__image--selected") || [];
			for (let t = 0; t < e.length; t++) e[t].classList.remove("p-gui__image--selected"), e[t].setAttribute("aria-pressed", "false");
			s && (l.classList.add("p-gui__image--selected"), l.setAttribute("aria-pressed", "true")), typeof this.callback == "function" && this.callback({
				path: t,
				text: i
			}), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		};
		l.addEventListener("click", d), l.addEventListener("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), d());
		});
	}
	onClick(e) {
		return this.callback = e, this;
	}
}, a = class {
	constructor(e, t, r, i = {}) {
		this.parent = e, this.callback = null;
		let a = !!i.readonly;
		if (!t || typeof t != "object" || typeof r != "string") throw Error("[GUI] toggle() invalid parameters.");
		let o = typeof i.label == "string" && i.label !== "" ? i.label : r, s = n(t, r), c = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? o : null, l = document.createElement("div");
		l.textContent = o, l.className = "p-gui__toggle", l.setAttribute("role", "switch"), l.setAttribute("tabindex", a ? "-1" : "0"), l.setAttribute("aria-checked", String(!!t[r])), c && l.setAttribute("title", c), a && (l.setAttribute("data-readonly", "true"), l.setAttribute("aria-readonly", "true")), this.parent.wrapper.append(l), this.element = l;
		let u = t[r] ? " p-gui__toggle-checkbox--active" : "", d = document.createElement("div");
		d.className = "p-gui__toggle-checkbox" + u, l.append(d);
		let f = () => {
			if (a) return;
			let e = !0;
			d.classList.contains("p-gui__toggle-checkbox--active") && (e = !1), d.classList.toggle("p-gui__toggle-checkbox--active"), l.setAttribute("aria-checked", String(e)), t[r] = e, this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		};
		l.addEventListener("click", (e) => {
			!e.target || !(e.target instanceof HTMLElement) || f();
		}), l.addEventListener("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), f());
		}), s.listeners.add((e) => {
			e ? d.classList.add("p-gui__toggle-checkbox--active") : d.classList.remove("p-gui__toggle-checkbox--active"), l.setAttribute("aria-checked", String(!!e)), typeof this.callback == "function" && this.callback(e);
		});
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, o = class {
	constructor(e, t, r, i, a = {}) {
		if (this.parent = e, this.callback = null, !t || typeof t != "object" || typeof r != "string") throw Error("[GUI] list() invalid parameters.");
		let o = typeof a.label == "string" ? a.label : r, s = Array.isArray(i) ? i : null;
		if (!s) throw Error("[GUI] list() Third argument must be an array.");
		let c = s && s.length > 0 && typeof s[0] == "object", l = typeof a.tooltip == "string" ? a.tooltip : a.tooltip === !0 ? o : null, u = (() => {
			if (!s) return null;
			if (typeof t[r] == "string" || typeof t[r] == "number") return c ? s.find((e) => e.value === t[r])?.value : s.indexOf(t[r]);
		})(), d = n(t, r), f = document.createElement("div");
		f.className = "p-gui__list", f.textContent = o, l && f.setAttribute("title", l), this.parent.wrapper.append(f), this.element = f;
		let p = document.createElement("select");
		f.append(p), p.className = "p-gui__list-dropdown", p.setAttribute("aria-label", o), p.addEventListener("change", (e) => {
			t[r] = e.target.value, this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		}), s && s.forEach((e, t) => {
			let n = c ? e.label : e, r = c ? e.value : e, i = document.createElement("option");
			i.setAttribute("value", String(r)), i.textContent = String(n), p.append(i), (!c && u == t || c && u == r) && i.setAttribute("selected", "");
		}), d.listeners.add((e) => {
			let t, n, r;
			if (c) {
				if (r = s?.find((t) => t.value == e), !r) {
					console.error(`[GUI] list() value ${e} not found in values`);
					return;
				}
				n = r?.value || s[0].value, t = s.indexOf(r);
			} else typeof e == "string" && (t = s.indexOf(e), n = e), typeof e == "number" && (t = s.indexOf(e), n = e);
			if (t === void 0 || n === void 0) {
				console.error("[GUI] list() newIndex or newValue is undefined");
				return;
			}
			d.value = c ? n : e;
			let i = p.querySelector("[selected]");
			i && i.removeAttribute("selected"), p.querySelectorAll("option")[t].setAttribute("selected", ""), typeof this.callback == "function" && (c && r ? this.callback(r, t) : this.callback(n, t));
		});
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, s = class {
	constructor(e, t, r, i = {}) {
		this.callback = null, this.parent = e;
		let a = !!i.readonly;
		if (typeof t != "object" || typeof r != "string") throw Error("[GUI] color() invalid parameters. Expected (object, string, options).");
		let o = typeof i.label == "string" && i.label || "\xA0";
		o === "\xA0" && (o = r);
		let s = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? o : null, c = n(t, r), l = t[r] || "#000000", u = document.createElement("div");
		u.className = "p-gui__color", u.textContent = o, s && u.setAttribute("title", s), a && u.setAttribute("data-readonly", "true"), this.parent.wrapper.append(u), this.element = u;
		let d = document.createElement("input");
		d.className = "p-gui__color-picker", d.setAttribute("type", "color"), d.setAttribute("aria-label", o), d.value = l, a && (d.disabled = !0), u.append(d), d.addEventListener("input", () => {
			a || (t[r] = d.value, this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate());
		}), c.listeners.add((e) => {
			d.value = e, typeof this.callback == "function" && this.callback(e);
		});
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, c = class {
	constructor(e, t, r, i, a = {}) {
		this.parent = e, this.callback = null;
		let o = !!a.readonly, s, c;
		if (t && typeof t == "object" && typeof r == "string" && typeof i == "string") s = t, c = t, r = r, i = i;
		else throw Error("[GUI] vector2() invalid parameters. Use: gui.vector2(obj, 'propX', 'propY', options)");
		let l = typeof a.label == "string" && a.label || "\xA0";
		l === "\xA0" && (l = r + " / " + i);
		let u = a.x || {}, d = a.y || {}, f = u.min ?? a.min ?? 0, p = u.max ?? a.max ?? 1, m = d.min ?? a.min ?? 0, h = d.max ?? a.max ?? 1, g = u.step || a.step || (p - f) / 100, _ = d.step || a.step || (h - m) / 100, v = this.parent._countDecimals(g), y = this.parent._countDecimals(_), b = n(s, r), x = n(c, i), S = typeof a.tooltip == "string" ? a.tooltip : a.tooltip === !0 ? l : null, C = document.createElement("div");
		C.className = "p-gui__vector2", C.textContent = l, S && C.setAttribute("title", S), o && C.setAttribute("data-readonly", "true"), this.parent.wrapper.append(C), this.element = C;
		let w = document.createElement("div");
		w.className = "p-gui__vector-value", w.textContent = s[r] + ", " + c[i], C.append(w);
		let T = document.createElement("div");
		T.className = "p-gui__vector2-area", T.setAttribute("role", "slider"), T.setAttribute("tabindex", o ? "-1" : "0"), T.setAttribute("aria-label", l), o && T.setAttribute("aria-readonly", "true"), C.append(T);
		let E = (e, t) => {
			if (o) return;
			let n = Math.max(f, Math.min(p, e)), a = Math.max(m, Math.min(h, t));
			s[r] = parseFloat(n.toFixed(v)), c[i] = parseFloat(a.toFixed(y)), this.callback && this.callback(s[r], c[i]), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		};
		T.addEventListener("click", (e) => {
			E(this.parent._mapLinear(e.offsetX, 0, T.clientWidth, f, p), this.parent._mapLinear(e.offsetY, 0, T.clientHeight, h, m));
		});
		let D = (e) => {
			let t = T.getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
			E(this.parent._mapLinear(n, 0, T.clientWidth, f, p), this.parent._mapLinear(r, 0, T.clientHeight, h, m));
		};
		T.addEventListener("pointerdown", (e) => {
			D(e), document.addEventListener("pointermove", D), document.addEventListener("pointerup", () => {
				document.removeEventListener("pointermove", D);
			}, { once: !0 });
		}), T.addEventListener("keydown", (e) => {
			let t = 0, n = 0;
			if (e.key === "ArrowRight") t = g;
			else if (e.key === "ArrowLeft") t = -g;
			else if (e.key === "ArrowUp") n = _;
			else if (e.key === "ArrowDown") n = -_;
			else return;
			e.preventDefault(), E(s[r] + t, c[i] + n);
		});
		let O = document.createElement("div");
		O.className = "p-gui__vector2-line p-gui__vector2-line-x", T.append(O);
		let k = document.createElement("div");
		k.className = "p-gui__vector2-line p-gui__vector2-line-y", T.append(k);
		let A = document.createElement("div");
		A.className = "p-gui__vector2-dot", T.append(A);
		let j = () => {
			A.style.left = this.parent._mapLinear(s[r], f, p, 0, T.clientWidth) + "px", A.style.top = this.parent._mapLinear(c[i], m, h, T.clientHeight, 0) + "px", T.setAttribute("aria-valuetext", `${s[r]}, ${c[i]}`);
		};
		j(), new ResizeObserver(() => {
			j();
		}).observe(T), b.listeners.add((e) => {
			j(), w.textContent = String(e) + ", " + c[i];
		}), x.listeners.add((e) => {
			j(), w.textContent = s[r] + ", " + String(e);
		});
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, l = 180 / Math.PI, u = Math.PI / 180, d = class {
	constructor(e, t, r, i = {}) {
		if (this.callback = null, this._onPointerMove = (e) => {
			this.dial.pointerDown && this._updateFromPointer(e);
		}, this._onPointerUp = () => {
			this.dial.pointerDown = !1, document.removeEventListener("pointermove", this._onPointerMove);
		}, this.parent = e, t && typeof t == "object" && typeof r == "string") this.obj = t, this.prop = r;
		else throw Error("[GUI] angle() invalid parameters.");
		this.isReadonly = !!i.readonly;
		let a = typeof i.label == "string" && i.label || " ";
		a == " " && (a = this.prop), this.unit = i.unit === "rad" ? "rad" : "deg";
		let o = this._fromDeg(360), s = i.min ?? 0, c = i.max ?? s + o, l = i.step || this._fromDeg(1);
		this.minDeg = this._toDeg(s), this.maxDeg = this._toDeg(c), this.stepDeg = Math.abs(this._toDeg(l)) || 1, this.wraps = this.maxDeg - this.minDeg >= 359.999999, this.decimals = this.unit == "rad" ? 3 : this.parent._countDecimals(l);
		let u = n(this.obj, this.prop), d = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? a : null, f = document.createElement("div");
		f.className = "p-gui__angle", d && f.setAttribute("title", d), this.isReadonly && f.setAttribute("data-readonly", "true"), this.parent.wrapper.append(f), this.element = f;
		let p = document.createElement("div");
		if (p.className = "p-gui__angle-name", p.textContent = a, f.append(p), this.dial = document.createElement("div"), this.dial.className = "p-gui__angle-dial", this.dial.setAttribute("role", "slider"), this.dial.setAttribute("tabindex", this.isReadonly ? "-1" : "0"), this.dial.setAttribute("aria-label", a), this.isReadonly && this.dial.setAttribute("aria-readonly", "true"), this.wraps || (this.dial.setAttribute("aria-valuemin", String(this.minDeg)), this.dial.setAttribute("aria-valuemax", String(this.maxDeg))), f.append(this.dial), !this.wraps) {
			let e = this.maxDeg - this.minDeg;
			this.dial.style.backgroundImage = `conic-gradient(from ${this.minDeg}deg, transparent ${e}deg, rgba(255, 255, 255, .2) ${e}deg)`;
		}
		this.needle = document.createElement("div"), this.needle.className = "p-gui__angle-needle", this.dial.append(this.needle);
		let m = document.createElement("div");
		m.className = "p-gui__angle-handle", this.needle.append(m), this.valueInput = document.createElement("input"), this.valueInput.className = "p-gui__angle-value", this.valueInput.setAttribute("aria-label", a), this.isReadonly && (this.valueInput.readOnly = !0, this.valueInput.tabIndex = -1), f.append(this.valueInput);
		let h = document.createElement("div");
		h.className = "p-gui__angle-unit", h.textContent = this.unit == "rad" ? "rad" : "°", f.append(h), this._display(this._readDeg()), this.valueInput.addEventListener("change", () => {
			if (this.isReadonly) return;
			let e = parseFloat(this.valueInput.value), t = isNaN(e) ? this._readDeg() : this._toDeg(e);
			this._display(this._resolveDeg(t)), this._triggerCallbacks();
		}), this.dial.addEventListener("pointerdown", (e) => {
			this.isReadonly || (this.dial.pointerDown = !0, this._updateFromPointer(e), document.addEventListener("pointermove", this._onPointerMove), document.addEventListener("pointerup", this._onPointerUp, { once: !0 }));
		}), this.dial.addEventListener("keydown", (e) => {
			if (this.isReadonly) return;
			let t = 0;
			if (e.key === "ArrowRight" || e.key === "ArrowUp") t = this.stepDeg;
			else if (e.key === "ArrowLeft" || e.key === "ArrowDown") t = -this.stepDeg;
			else if (e.key === "Home") {
				this._display(this._resolveDeg(this.minDeg)), this._triggerCallbacks(), e.preventDefault();
				return;
			} else if (e.key === "End") {
				this._display(this._resolveDeg(this.maxDeg)), this._triggerCallbacks(), e.preventDefault();
				return;
			} else return;
			e.preventDefault(), this._display(this._resolveDeg(this._readDeg() + t)), this._triggerCallbacks();
		}), u.listeners.add((e) => {
			this._display(this._readDeg()), this.callback && this.callback(e);
		});
	}
	_updateFromPointer(e) {
		let t = this.dial.getBoundingClientRect(), n = t.left + t.width / 2, r = t.top + t.height / 2, i = Math.atan2(e.clientX - n, r - e.clientY) * l;
		this._display(this._resolveDeg(i)), this._triggerCallbacks();
	}
	_resolveDeg(e) {
		let t = this.minDeg + this._mod(e - this.minDeg, 360);
		return !this.wraps && t > this.maxDeg && (t = t - this.maxDeg < this.minDeg + 360 - t ? this.maxDeg : this.minDeg), t = this.minDeg + Math.round((t - this.minDeg) / this.stepDeg) * this.stepDeg, t = this.wraps ? this.minDeg + this._mod(t - this.minDeg, 360) : Math.max(this.minDeg, Math.min(this.maxDeg, t)), parseFloat(t.toFixed(9));
	}
	_readDeg() {
		let e = this.obj[this.prop];
		return typeof e == "number" && isFinite(e) ? this._toDeg(e) : this.minDeg;
	}
	_display(e) {
		this.needle.style.transform = `rotate(${e - 90}deg)`, this.valueInput.value = this._fromDeg(e).toFixed(this.decimals), this.dial.setAttribute("aria-valuenow", this.valueInput.value), this.dial.setAttribute("aria-valuetext", `${this.valueInput.value}${this.unit == "rad" ? " rad" : "°"}`);
	}
	_triggerCallbacks() {
		this.obj[this.prop] = parseFloat(this.valueInput.value), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
	}
	_toDeg(e) {
		return this.unit == "rad" ? e * l : e;
	}
	_fromDeg(e) {
		return this.unit == "rad" ? e * u : e;
	}
	_mod(e, t) {
		return (e % t + t) % t;
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, f = class {
	constructor(e, t, r, i = {}) {
		this.callback = null, this.parent = e;
		let a = !!i.readonly;
		if (!t || typeof t != "object" || typeof r != "string") throw Error("[GUI] text() invalid parameters. Expected (object, string, options).");
		let o = typeof i.label == "string" && i.label || " ";
		o === " " && (o = r);
		let s = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? o : null, c = n(t, r), l = t[r] ?? "", u = document.createElement("div");
		u.className = "p-gui__text", u.textContent = o, s && u.setAttribute("title", s), a && u.setAttribute("data-readonly", "true"), this.parent.wrapper.append(u), this.element = u;
		let d = document.createElement("input");
		d.className = "p-gui__text-input", d.setAttribute("type", "text"), d.setAttribute("aria-label", o), typeof i.placeholder == "string" && d.setAttribute("placeholder", i.placeholder), typeof i.maxLength == "number" && (d.maxLength = i.maxLength), d.value = String(l), a && (d.readOnly = !0, d.tabIndex = -1), u.append(d), d.addEventListener("input", () => {
			a || (t[r] = d.value, this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate());
		}), c.listeners.add((e) => {
			let t = e ?? "";
			d.value !== t && (d.value = t), typeof this.callback == "function" && this.callback(t);
		});
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, p = class {
	constructor(e, t, r, i = {}) {
		this.callback = null, this.parent = e, this.min = i.min, this.max = i.max;
		let a = !!i.readonly;
		if (!t || typeof t != "object" || typeof r != "string") throw Error("[GUI] number() invalid parameters. Expected (object, string, options).");
		let o = typeof i.label == "string" && i.label || " ";
		o === " " && (o = r);
		let s = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? o : null, c = n(t, r), l = typeof t[r] == "number" ? t[r] : 0, u = document.createElement("div");
		u.className = "p-gui__number", u.textContent = o, s && u.setAttribute("title", s), a && u.setAttribute("data-readonly", "true"), this.parent.wrapper.append(u), this.element = u;
		let d = i.step || 1, f = this.parent._countDecimals(d), p = document.createElement("div");
		p.className = "p-gui__number-ctrl", u.append(p);
		let m = document.createElement("input");
		m.className = "p-gui__number-input", m.setAttribute("type", "number"), m.setAttribute("aria-label", o), typeof i.min == "number" && m.setAttribute("min", String(i.min)), typeof i.max == "number" && m.setAttribute("max", String(i.max)), m.setAttribute("step", String(d)), typeof i.placeholder == "string" && m.setAttribute("placeholder", i.placeholder), m.value = String(l), a && (m.readOnly = !0, m.tabIndex = -1), p.append(m);
		let h = document.createElement("div");
		h.className = "p-gui__number-stepper", p.append(h);
		let g = document.createElement("div");
		g.className = "p-gui__number-arrow p-gui__number-arrow--up", g.setAttribute("role", "button"), g.setAttribute("tabindex", "-1"), g.setAttribute("aria-label", `Increase ${o}`), h.append(g);
		let _ = document.createElement("div");
		_.className = "p-gui__number-arrow p-gui__number-arrow--down", _.setAttribute("role", "button"), _.setAttribute("tabindex", "-1"), _.setAttribute("aria-label", `Decrease ${o}`), h.append(_);
		let v = () => {
			if (a) return;
			let e = parseFloat(m.value);
			isNaN(e) && (e = 0), typeof this.min == "number" && (e = Math.max(this.min, e)), typeof this.max == "number" && (e = Math.min(this.max, e)), m.value = String(e), t[r] = e, this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		}, y = (e) => {
			if (a) return;
			let t = parseFloat(m.value);
			isNaN(t) && (t = 0);
			let n = Math.max(f, this.parent._countDecimals(t)), r = parseFloat((t + e * d).toFixed(n));
			m.value = String(r), v(), m.focus();
		};
		m.addEventListener("change", v), m.addEventListener("keydown", (e) => {
			e.key === "ArrowUp" ? (e.preventDefault(), y(1)) : e.key === "ArrowDown" && (e.preventDefault(), y(-1));
		}), g.addEventListener("pointerdown", (e) => {
			e.preventDefault(), y(1);
		}), _.addEventListener("pointerdown", (e) => {
			e.preventDefault(), y(-1);
		}), c.listeners.add((e) => {
			let t = String(e);
			m.value !== t && (m.value = t), typeof this.callback == "function" && this.callback(e);
		});
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, m = ".p-gui__button{background:var(--color-accent);text-align:center;color:var(--color-bg);box-sizing:border-box;transition:var(--transition) background, var(--transition) border-color;border:1px solid #0000}.p-gui__button:hover{background:var(--color-accent-hover);border-color:#fff3}.p-gui__folder .p-gui__button{margin-inline:0}", h = ".p-gui__slider{min-height:14px;color:var(--color-text-dark);transition:color var(--transition);touch-action:none;justify-content:space-between;align-items:center;gap:10px;padding:3px;display:flex;position:relative}.p-gui__slider:hover{color:var(--color-text-light)}.p-gui__slider-name{text-overflow:ellipsis;width:50%;overflow:hidden}.p-gui__slider-ctrl{-webkit-appearance:none;font:inherit;box-sizing:border-box;cursor:pointer;touch-action:none;outline:none;width:37%;height:14px;margin:0 0 0 auto;padding:0;position:relative;right:0}.p-gui__slider-bar{background:#fff3;width:100%;height:2px;position:absolute;top:50%;left:0;transform:translateY(-50%)}.p-gui__slider-filling{background:var(--color-accent);pointer-events:none;width:0;height:100%;position:absolute;top:-25%;left:0}.p-gui__slider:hover .p-gui__slider-filling{background:var(--color-accent-hover)}.p-gui__slider-handle{pointer-events:none;background:var(--color-text-dark);border-radius:2px;width:9px;height:9px;position:absolute;top:50%;left:0;transform:translate(-50%,-50%);box-shadow:0 0 2px #00000080}.p-gui__slider:hover .p-gui__slider-handle{background:var(--color-text-light)}.p-gui__slider-value{color:inherit;width:13%;background:#ffffff1a;border:none;border-radius:2px;padding:2px 4px;display:inline-block;right:7px}.p-gui__slider-value:focus{outline:none}.p-gui__slider[data-readonly=true] .p-gui__slider-ctrl,.p-gui__slider[data-readonly=true] .p-gui__slider-value{cursor:default}.p-gui__slider[data-readonly=true] .p-gui__slider-handle{display:none}", g = ".p-gui__list{cursor:default;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__list:hover{color:var(--color-text-light)}.p-gui__list-dropdown{color:#fff;background:#ffffff0d;padding:0 12px 0 5px;top:0}.p-gui__list-dropdown{cursor:pointer;border:1px solid var(--color-border-2);border-radius:3px;outline:none;height:calc(100% - 4px);margin:auto;position:absolute;top:0;bottom:0;right:5px}.p-gui__list-dropdown option{color:#000;background:#fff}.p-gui__list-dropdown:hover{background:#ffffff1a}", _ = ".p-gui__toggle{color:var(--color-text-dark);transition:var(--transition) background, var(--transition) color}.p-gui__toggle:hover{color:var(--color-text-light);background:#ffffff1a}.p-gui__folder .p-gui__toggle{margin-inline:0}.p-gui__toggle-checkbox{box-sizing:border-box;pointer-events:none;background-color:#ffffff1a;border:1px solid #ffffff26;border-radius:999px;width:26px;height:14px;margin:auto;transition:background-color .2s,border-color .2s;position:absolute;top:0;bottom:0;right:10px}.p-gui__toggle-checkbox:before{content:\"\";background-color:#ddd;border-radius:50%;width:10px;height:10px;transition:transform .2s,background-color .2s;position:absolute;top:50%;left:1px;transform:translateY(-50%)}.p-gui__toggle-checkbox--active{border-color:var(--color-border);background-color:#ddd}.p-gui__toggle-checkbox--active:before{background-color:var(--color-border);box-shadow:0 0 4px var(--color-accent-hover);transform:translate(12px,-50%)}.p-gui__toggle[data-readonly=true]:hover{color:var(--color-text-dark);background:0 0}", v = ".p-gui__color{cursor:default;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__color:hover{color:var(--color-text-light)}.p-gui__color-picker{cursor:pointer;border:1px solid var(--color-border-2);-webkit-appearance:none;background-color:#0000;border:1px solid #222;border-radius:3px;outline:none;height:calc(100% - 4px);margin:auto;padding:0;position:absolute;top:0;bottom:0;right:5px;overflow:hidden}.p-gui__color-picker::-webkit-color-swatch-wrapper{padding:0}.p-gui__color-picker::-webkit-color-swatch{border:none}.p-gui__color-picker:disabled{cursor:default;opacity:.8}", y = ".p-gui__vector2{color:var(--color-text-dark);cursor:default;background:0 0}.p-gui__vector2:hover{color:var(--color-text-light)}.p-gui__vector2-area{--sub-color:#282828;background-color:#0000004d;background-image:repeating-linear-gradient(to bottom, var(--sub-color) 0, var(--sub-color) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to bottom, var(--sub-color) 0, var(--sub-color) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to right, var(--sub-color) 0, var(--sub-color) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to right, var(--sub-color) 0, var(--sub-color) 1px, transparent 1px, transparent 4px);border:1px solid var(--color-border);aspect-ratio:1;box-sizing:border-box;touch-action:none;cursor:pointer;background-position:25% 0,75% 0,0 25%,0 75%;background-repeat:no-repeat;background-size:1px 100%,1px 100%,100% 1px,100% 1px;width:50%;margin-top:8px;margin-left:auto;position:relative}.p-gui__vector2-line{opacity:1;pointer-events:none;background:#333;position:absolute}.p-gui__vector2-line-x{width:100%;height:1px;top:50%;left:0;transform:translateY(-50%)}.p-gui__vector2-line-y{width:1px;height:100%;top:0;left:50%;transform:translate(-50%)}.p-gui__vector2-dot{pointer-events:none;background:#d5d5d5;border:2px solid #f99;border-radius:50%;width:8px;height:8px;position:absolute;top:0;left:0;transform:translate(-50%,-50%)}.p-gui__vector-value{display:inline-block;position:absolute;right:7px}.p-gui__vector2[data-readonly=true] .p-gui__vector2-area{cursor:default}", b = ".p-gui__angle{min-height:34px;color:var(--color-text-dark);transition:color var(--transition);touch-action:none;align-items:center;gap:8px;padding:3px;display:flex;position:relative}.p-gui__angle:hover{color:var(--color-text-light)}.p-gui__angle-name{text-overflow:ellipsis;width:50%;overflow:hidden}.p-gui__angle-dial{box-sizing:border-box;border:1px solid var(--color-accent);cursor:pointer;touch-action:none;background:#0000004d;border-radius:50%;flex:none;width:28px;height:28px;margin-left:auto;position:relative}.p-gui__angle-dial:after{content:\"\";background:#ffffff4d;border-radius:50%;width:3px;height:3px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.p-gui__angle-needle{transform-origin:0;background:var(--color-accent);pointer-events:none;width:50%;height:1px;position:absolute;top:50%;left:50%}.p-gui__angle:hover .p-gui__angle-needle{background:var(--color-accent-hover)}.p-gui__angle-handle{background:var(--color-text-dark);border-radius:50%;width:5px;height:5px;position:absolute;top:50%;right:0;transform:translate(50%,-50%);box-shadow:0 0 2px #00000080}.p-gui__angle:hover .p-gui__angle-handle{background:var(--color-text-light)}.p-gui__angle-value{width:34px;color:inherit;text-align:right;background:#ffffff1a;border:none;border-radius:2px;padding:2px 4px}.p-gui__angle-value:focus{outline:none}.p-gui__angle-unit{opacity:.6;width:18px}.p-gui__angle[data-readonly=true] .p-gui__angle-dial{cursor:default}.p-gui__angle[data-readonly=true] .p-gui__angle-handle{display:none}", x = ".p-gui__image-container{box-sizing:border-box;flex-wrap:wrap;justify-content:flex-start;width:100%;padding:3px;display:flex}.p-gui__image{cursor:pointer;border-radius:var(--main-border-radius);height:90px;color:var(--color-text-dark);transition:var(--transition) color;background-position:50%;background-size:cover;flex:0 0 calc(33.333% - 5px);margin:1px 2.5px 19px;position:relative}.p-gui__image:hover{color:var(--color-text-light)}.p-gui__image:after{content:\"\";box-sizing:border-box;border-radius:var(--main-border-radius);width:100%;height:100%;transition:var(--transition) border-color;border:1px solid #0000;position:absolute;top:0;left:0}.p-gui__image--selected:after{border-color:#06ff89}.p-gui__image-text{text-shadow:0 -1px #111;white-space:nowrap;text-overflow:ellipsis;width:100%;position:absolute;bottom:-15px;overflow:hidden}", S = ".p-gui__folder{background:var(--color-bg);border:1px solid var(--color-border-2);border-radius:var(--main-border-radius);box-sizing:border-box;border-left:1px solid #bbb;flex-wrap:wrap;width:100%;margin-bottom:2px;display:flex;position:relative}.p-gui__folder--first{margin-top:0}.p-gui__folder-content{grid-template-rows:1fr;width:100%;transition:grid-template-rows .25s;display:grid}.p-gui__folder-inner{padding-left:3px;padding-right:2px;overflow:hidden}.p-gui__folder--closed .p-gui__folder-content{grid-template-rows:0fr}.p-gui__folder-header{color:#fff;cursor:pointer;box-sizing:border-box;border-top-right-radius:var(--main-border-radius);border-bottom-right-radius:var(--main-border-radius);background-color:#00000080;width:100%;padding:5px 3px}.p-gui__folder-header:hover{background-color:#000000bf}.p-gui__folder-arrow{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAHlBMVEUAAAD///////////////////////////////////8kfJuVAAAACXRSTlMA9Z1fCdMo1yxEJnA0AAAAK0lEQVQI12PABlRgjKkJUMZMYRhjpgqMAZSEMICSaIzpDWiKhdENhEhgAgATSg5jyWnYewAAAABJRU5ErkJggg==);background-size:contain;width:8px;height:8px;margin-right:5px;display:inline-block;transform:rotate(90deg)}.p-gui__folder--closed .p-gui__folder-arrow{transform:rotate(0)}", C = ".p-gui__tabs{background:var(--color-bg);border:1px solid var(--color-border-2);border-radius:var(--main-border-radius);box-sizing:border-box;border-left:1px solid #bbb;width:100%;margin-bottom:2px;padding-block:0;position:relative}.p-gui__tabs--first{margin-top:0}.p-gui__tabs-header{border-top-left-radius:var(--main-border-radius);border-top-right-radius:var(--main-border-radius);background-color:#00000080;display:flex}.p-gui__tab-button{color:#bbb;cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:none;flex:1;padding:7px 10px;font-family:inherit;overflow:hidden}.p-gui__tab-button:last-child{border-right:none}.p-gui__tab-button:hover{color:#fff}.p-gui__tab-button--active{background-color:var(--color-bg);color:#fff;border-bottom:1px solid #0000}.p-gui__tabs-content{width:100%;position:relative}.p-gui__tab-pane{box-sizing:border-box;width:100%;padding-top:4px;display:none}.p-gui__tab-pane--active{display:block}", w = ".p-gui__text{cursor:default;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__text:hover{color:var(--color-text-light)}.p-gui__text-input{box-sizing:border-box;cursor:text;border:1px solid var(--color-border-2);color:#fff;background:#ffffff0d;border-radius:3px;outline:none;width:45%;height:calc(100% - 4px);margin:auto;padding:0 6px;position:absolute;top:0;bottom:0;right:5px}.p-gui__text-input:hover{background:#ffffff1a}.p-gui__text-input::placeholder{color:var(--color-text-dark)}.p-gui__text[data-readonly=true] .p-gui__text-input{cursor:default}", T = ".p-gui__number{cursor:default;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__number:hover{color:var(--color-text-light)}.p-gui__number-ctrl{box-sizing:border-box;border:1px solid var(--color-border-2);background:#ffffff0d;border-radius:3px;width:45%;height:calc(100% - 4px);margin:auto;display:flex;position:absolute;top:0;bottom:0;right:5px;overflow:hidden}.p-gui__number-ctrl:hover{background:#ffffff1a}.p-gui__number-input{box-sizing:border-box;cursor:text;color:#fff;appearance:textfield;background:0 0;border:none;outline:none;flex:1;min-width:0;padding:0 0 0 6px}.p-gui__number-input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.p-gui__number-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.p-gui__number-input::placeholder{color:var(--color-text-dark)}input.p-gui__number-input:focus-visible{outline:none}.p-gui__number-ctrl:has(.p-gui__number-input:focus-visible){outline:2px solid var(--color-accent-hover);outline-offset:1px}.p-gui__number-stepper{border-left:1px solid var(--color-border-2);flex-direction:column;flex:0 0 12px;display:flex}.p-gui__number-arrow{cursor:pointer;flex:50%;justify-content:center;align-items:center;display:flex}.p-gui__number-arrow:hover{background:#ffffff1a}.p-gui__number-arrow:before{content:\"\";border-left:3px solid #0000;border-right:3px solid #0000;width:0;height:0}.p-gui__number-arrow--up{border-bottom:1px solid var(--color-border-2)}.p-gui__number-arrow--up:before{border-bottom:4px solid var(--color-text-dark)}.p-gui__number-arrow--down:before{border-top:4px solid var(--color-text-dark)}.p-gui__number-arrow--up:hover:before{border-bottom-color:var(--color-text-light)}.p-gui__number-arrow--down:hover:before{border-top-color:var(--color-text-light)}.p-gui__number[data-readonly=true] .p-gui__number-stepper{display:none}.p-gui__number[data-readonly=true] .p-gui__number-input{cursor:default}";
//#endregion
//#region src/styles/styles.ts
function E(e) {
	return `
    .p-gui {
        --main-border-radius: 6px;
        --color-bg: #161616;
        --color-border: #222222;
        --color-border-2: transparent;
        --color-text-light: #ffffff;
        --color-text-dark: #bbbbbb;
        --color-accent: #bbbbbb;
        --color-accent-hover: #dddddd;
        --transition: .1s linear;
    
        position: ${e};
        top: 0;
        left: 0;
        transform: translate3d(0,0,0);
        background: var(--color-bg);
        display: flex;
        flex-direction: column;
        font-family: "Arial Rounded MT Bold", Arial, sans-serif;
        width: 290px;
        box-shadow: 0 0 2px black;
        box-sizing: border-box;
        z-index: 99999;
        user-select: none;
        cursor: auto;
        border-radius: var(--main-border-radius);
        border: 1px solid var(--color-border);
        line-height: normal;
        transition: var(--transition) opacity;
        overflow: hidden;
    }

    .p-gui__content {
        display: grid;
        grid-template-rows: 1fr;
        transition: 250ms grid-template-rows ease;
        overflow: hidden;
    }

    .p-gui__inner {
        padding-top: 1px;
        padding-inline: 3px;
        overflow: hidden;
        min-height: 0;
    }

    .p-gui:not(.p-gui--collapsed) .p-gui__inner {
        animation: p-gui-reveal-scroll 0s 250ms forwards;
    }

    @keyframes p-gui-reveal-scroll {
        from { overflow: hidden; }
        to { overflow: auto; }
    }

    .p-gui--collapsed .p-gui__content {
        grid-template-rows: 0fr;
    }
    
    .p-gui:hover {
        opacity: 1!important;
    }
    
    .p-gui * {
        font-size: 11px;
    }
    
    .p-gui::-webkit-scrollbar,
    .p-gui *::-webkit-scrollbar {
        width: 10px;
    }
    
    .p-gui::-webkit-scrollbar-track,
    .p-gui *::-webkit-scrollbar-track {
        background: #2f2f2f; 
        border-radius: 3px;
    }
    
    .p-gui::-webkit-scrollbar-thumb,
    .p-gui *::-webkit-scrollbar-thumb {
        background: #757576; 
        border-radius: 10px;
        box-sizing: border-box;
        border: 1px solid #2f2f2f;
    }
    
    .p-gui__header {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 20px;
        background-color: rgba(0, 0, 0, .8);
        cursor: grab;
        color: grey;
        font-size: 10px;
        line-height: 20px;
        padding-left: 12px;
        box-sizing: border-box;
        touch-action: none;
    }
    
    .p-gui__header-close {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 0;
        right: 5px;
        cursor: pointer;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAABFJREFUCNdjIAb8//8BjIkAAOrOBd3TR0jRAAAAAElFTkSuQmCC);
        background-size: 50% 50%;
        background-position: center;
        background-repeat: no-repeat; 
    }
    
    .p-gui--collapsed .p-gui__header-close {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAABVJREFUCNdjYEhgIIj///8AwsSoBQD43QydY5mb0QAAAABJRU5ErkJggg==);
    }
    
    .p-gui__slider,
    .p-gui__button,
    .p-gui__toggle,
    .p-gui__list,
    .p-gui__vector2,
    .p-gui__angle,
    .p-gui__color,
    .p-gui__tabs,
    .p-gui__text,
    .p-gui__number {
        width: 100%;
        padding: 5px 3px;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
        margin-block: 3px;
        border: 1px solid var(--color-border-2);
        border-radius: var(--main-border-radius);
        transition: var(--transition) border-color;
    }

    .p-gui__slider:hover,
    .p-gui__button:hover,
    .p-gui__toggle:hover,
    .p-gui__list:hover,
    .p-gui__vector2:hover,
    .p-gui__angle:hover,
    .p-gui__color:hover,
    .p-gui__tabs:hover,
    .p-gui__text:hover,
    .p-gui__number:hover {
        border-color: rgba(255,255,255,.2);
    }

    .p-gui__slider[data-readonly="true"],
    .p-gui__toggle[data-readonly="true"],
    .p-gui__vector2[data-readonly="true"],
    .p-gui__angle[data-readonly="true"],
    .p-gui__color[data-readonly="true"],
    .p-gui__text[data-readonly="true"],
    .p-gui__number[data-readonly="true"] {
        cursor: default;
    }

    .p-gui__slider[data-readonly="true"]:hover,
    .p-gui__toggle[data-readonly="true"]:hover,
    .p-gui__vector2[data-readonly="true"]:hover,
    .p-gui__angle[data-readonly="true"]:hover,
    .p-gui__color[data-readonly="true"]:hover,
    .p-gui__text[data-readonly="true"]:hover,
    .p-gui__number[data-readonly="true"]:hover {
        border-color: var(--color-border-2);
    }

    .p-gui [role="button"]:focus-visible,
    .p-gui [role="switch"]:focus-visible,
    .p-gui [role="slider"]:focus-visible,
    .p-gui [role="tab"]:focus-visible,
    .p-gui input:focus-visible,
    .p-gui select:focus-visible,
    .p-gui button:focus-visible {
        outline: 2px solid var(--color-accent-hover);
        outline-offset: 1px;
    }

    ${m}
    
    ${x}
    
    ${g}
    
    ${_}

    ${h}
    
    ${v}
    
    ${y}

    ${b}

    ${S}

    ${C}

    ${w}

    ${T}
`;
}
//#endregion
//#region src/index.ts
var D = 0;
function O() {
	return ++D;
}
var k = class {
	constructor(e = {}, t = !1) {
		if (this.container = document.body, this.label = "", this.backgroundColor = null, this.opacity = 1, this.maxHeight = window.innerHeight, this.initMaxHeight = null, this.instanceId = 0, this.wrapperWidth = 290, this.stylesheet = null, this.closed = !1, this.domElement = null, this.hasBeenDragged = !1, this.xOffset = 0, this.yOffset = 0, this.position = {
			initX: 0,
			initY: 0,
			prevX: 0,
			prevY: 0,
			x: 0,
			y: 0
		}, this.isFolder = !1, this.parent = null, this.imageContainer = null, this.previousInnerScroll = 0, this.onUpdate = null, this.autoRepositioning = !1, this._boundHandleResize = this._handleResize.bind(this), this._onPointerDown = (e) => {
			e.preventDefault(), this.position.initX = this.position.x, this.position.initY = this.position.y, this.position.prevX = e.clientX, this.position.prevY = e.clientY, this.container.addEventListener("pointermove", this._onPointerMove), document.addEventListener("pointerup", this._onPointerUp);
		}, this._onPointerMove = (e) => {
			e.preventDefault(), this.hasBeenDragged || (this.hasBeenDragged = !0, this.domElement?.setAttribute("data-dragged", "true")), this.position.x = this.position.initX + e.clientX - this.position.prevX, this.position.y = this.position.initY + e.clientY - this.position.prevY, this.domElement && (this.domElement.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`);
		}, this._onPointerUp = () => {
			this.container.removeEventListener("pointermove", this._onPointerMove), document.removeEventListener("pointerup", this._onPointerUp);
		}, this.firstParent = this, this.folders = [], this.tabsArray = [], e.isFolder) {
			this._folderConstructor(e.folderOptions);
			return;
		}
		if (t) return;
		let n = "fixed";
		if (e.container) {
			let t = typeof e.container == "string" ? document.querySelector(e.container) : e.container;
			t instanceof HTMLElement && (this.container = t, n = "absolute");
		}
		this.screenCorner = this._parseScreenCorner(e.position), e.width && (this.wrapperWidth = e.width), typeof e.onUpdate == "function" && (this.onUpdate = e.onUpdate), this.label = typeof e.label == "string" ? e.label : "", this.backgroundColor = e.color || null, this.opacity = e.opacity || 1, this.container && this.container !== document.body && (this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight)), e.maxHeight && (this.initMaxHeight = e.maxHeight, this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), window.perfectGUI || (window.perfectGUI = {}), window.perfectGUI.instanceCounter == null ? window.perfectGUI.instanceCounter = 0 : window.perfectGUI.instanceCounter++, this.instanceId = window.perfectGUI.instanceCounter, this.stylesheet = document.createElement("style"), this.stylesheet.setAttribute("type", "text/css"), this.stylesheet.setAttribute("id", "lm-gui-stylesheet"), document.head.append(this.stylesheet), this.instanceId == 0 && this._addStyles(`${E(n)}`), this._styleInstance(), this.closed = !!e.closed;
		let [r, i] = this._addWrapper();
		this.domElement = r, this.wrapper = i, this.domElement.setAttribute("data-corner-x", this.screenCorner.x), this.domElement.setAttribute("data-corner-y", this.screenCorner.y), this.autoRepositioning = e.autoRepositioning != 0, this.autoRepositioning && window.addEventListener("resize", this._boundHandleResize), this._handleResize(), e.draggable == 1 && this._makeDraggable();
	}
	_styleInstance() {
		let e = this._getScrollbarWidth(this.container);
		if (this.screenCorner.x == "left" ? this.xOffset = 0 : this.xOffset = this.container.clientWidth - this.wrapperWidth - e, this.instanceId > 0) {
			let e = this.container.querySelectorAll(".p-gui");
			for (let t = 0; t < e.length; t++) this.screenCorner.y == e[t].dataset.cornerY && (this.screenCorner.x == "left" && e[t].dataset.cornerX == "left" ? this.xOffset += e[t].offsetWidth : this.screenCorner.x == "right" && e[t].dataset.cornerX == "right" && (this.xOffset -= e[t].offsetWidth));
		}
		this.yOffset = 0, this.position = {
			initX: this.xOffset,
			initY: this.yOffset,
			prevX: this.xOffset,
			prevY: this.yOffset,
			x: this.xOffset,
			y: this.yOffset
		}, this._addStyles(`#p-gui-${this.instanceId} {
            width: ${this.wrapperWidth}px;
            max-height: ${this.maxHeight}px;
            transform: translate3d(${this.xOffset}px,${this.yOffset}px,0);
            ${this.screenCorner.y == "top" ? "" : "top: auto; bottom: 0;"}
            ${this.backgroundColor ? "background: " + this.backgroundColor + ";" : ""}
            opacity: ${this.opacity};
        }`);
	}
	_folderConstructor(e) {
		if (!e) throw Error("[perfect-gui] folderOptions is undefined");
		this.domElement = e.container, this.isFolder = !0, this.parent = e.parent, this.firstParent = e.firstParent, this.wrapper = e.wrapper;
	}
	_parseScreenCorner(e) {
		let t = {
			x: "right",
			y: "top"
		};
		return e == null ? t : (typeof e != "string" && console.error("[perfect-gui] Position must be a string."), e.includes("left") && (t.x = "left"), e.includes("bottom") && (t.y = "bottom"), t);
	}
	_getScrollbarWidth(e) {
		return e === document.body ? window.innerWidth - document.documentElement.clientWidth : e.offsetWidth - e.clientWidth;
	}
	_handleResize() {
		if (!this.domElement || (this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight), this.initMaxHeight && (this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.domElement.style.maxHeight = this.maxHeight + "px", this.hasBeenDragged)) return;
		let e = this._getScrollbarWidth(this.container);
		if (this.xOffset = this.screenCorner.x == "left" ? 0 : this.container.clientWidth - this.wrapperWidth - e, this.instanceId > 0) {
			let e = this.container.querySelectorAll(`.p-gui:not(#${this.domElement.id}):not([data-dragged])`);
			for (let t = 0; t < e.length && !(parseInt(e[t].id.replace("p-gui-", "")) > this.instanceId); t++) this.screenCorner.y == e[t].dataset.cornerY && (this.screenCorner.x == "left" && e[t].dataset.cornerX == "left" ? this.xOffset += e[t].offsetWidth : this.screenCorner.x == "right" && e[t].dataset.cornerX == "right" && (this.xOffset -= e[t].offsetWidth));
		}
		this.position = {
			initX: this.xOffset,
			initY: this.yOffset,
			prevX: this.xOffset,
			prevY: this.yOffset,
			x: this.xOffset,
			y: this.yOffset
		}, this.domElement.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
	}
	_addStyles(e) {
		this.stylesheet && (this.stylesheet.innerHTML += e);
	}
	_addWrapper() {
		let e = document.createElement("div");
		e.id = "p-gui-" + this.instanceId, e.className = "p-gui" + (this.closed ? " p-gui--collapsed" : ""), e.setAttribute("data-lenis-prevent", ""), this.container.append(e), this.header = document.createElement("div"), this.header.className = "p-gui__header", this.header.textContent = this.label, this.header.style = `${this.backgroundColor ? "border-color: " + this.backgroundColor + ";" : ""}`, e.append(this.header);
		let t = document.createElement("div");
		t.className = "p-gui__content", t.id = "p-gui-content-" + this.instanceId, e.append(t);
		let n = document.createElement("div");
		n.className = "p-gui__header-close", n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-label", "Toggle panel"), n.setAttribute("aria-expanded", String(!this.closed)), n.setAttribute("aria-controls", t.id), n.addEventListener("click", this.toggleClose.bind(this)), n.addEventListener("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.toggleClose());
		}), this.header.append(n), this.closeBtn = n;
		let r = document.createElement("div");
		return r.className = "p-gui__inner", t.append(r), [e, r];
	}
	button(t = {}) {
		return this.imageContainer = null, new e(this, t);
	}
	image(e, t = {}) {
		return this.imageContainer || (this.imageContainer = document.createElement("div"), this.imageContainer.className = "p-gui__image-container", this.wrapper.append(this.imageContainer)), new i(this, e, t);
	}
	slider(e, t, n = {}) {
		return this.imageContainer = null, new r(this, e, t, n);
	}
	toggle(e, t, n = {}) {
		return this.imageContainer = null, new a(this, e, t, n);
	}
	list(e, t, n, r = {}) {
		return this.imageContainer = null, new o(this, e, t, n, r);
	}
	color(e, t, n = {}) {
		return this.imageContainer = null, new s(this, e, t, n);
	}
	vector2(e, t, n, r = {}) {
		return this.imageContainer = null, new c(this, e, t, n, r);
	}
	angle(e, t, n = {}) {
		return this.imageContainer = null, new d(this, e, t, n);
	}
	text(e, t, n = {}) {
		return this.imageContainer = null, new f(this, e, t, n);
	}
	number(e, t, n = {}) {
		return this.imageContainer = null, new p(this, e, t, n);
	}
	folder(e) {
		let t = typeof e.closed == "boolean" ? e.closed : !1, n = e.label || "", r = e.color || null, i = e.maxHeight || null;
		this.imageContainer = null;
		let a = "p-gui__folder";
		this.folders.length == 0 && (a += " p-gui__folder--first"), t && (a += " p-gui__folder--closed");
		let o = r ? `background-color: ${r};` : "";
		o += i ? `max-height: ${i}px; overflow-y: auto;` : "";
		let s = document.createElement("div");
		s.className = a, s.style = o, this.wrapper.append(s);
		let c = document.createElement("div");
		c.innerHTML = `<span class="p-gui__folder-arrow"></span>${n}`, c.className = "p-gui__folder-header", s.append(c);
		let l = document.createElement("div");
		l.className = "p-gui__folder-content", l.id = "p-gui-folder-content-" + O(), s.append(l);
		let u = document.createElement("div");
		u.className = "p-gui__folder-inner", l.append(u), c.setAttribute("role", "button"), c.setAttribute("tabindex", "0"), c.setAttribute("aria-expanded", String(!t)), c.setAttribute("aria-controls", l.id);
		let d = () => {
			let e = s.classList.toggle("p-gui__folder--closed");
			c.setAttribute("aria-expanded", String(!e));
		};
		c.addEventListener("click", d), c.addEventListener("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), d());
		});
		let f = new A({
			container: s,
			wrapper: u,
			parent: this,
			firstParent: this.firstParent
		});
		return this.folders.push(f), f;
	}
	tabs(e = {}) {
		let t = Array.isArray(e.tabs) ? e.tabs : [], n = e.active || 0, r = e.color || null, i = e.maxHeight || null;
		this.imageContainer = null;
		let a = "p-gui__tabs";
		this.tabsArray.length == 0 && (a += " p-gui__tabs--first");
		let o = r ? `background-color: ${r};` : "";
		o += i ? `max-height: ${i}px; overflow-y: auto;` : "";
		let s = document.createElement("div");
		s.className = a, s.style = o, this.wrapper.append(s);
		let c = document.createElement("div");
		c.className = "p-gui__tabs-header", c.setAttribute("role", "tablist"), s.append(c);
		let l = document.createElement("div");
		l.className = "p-gui__tabs-content", s.append(l);
		let u = [];
		t.forEach((e, r) => {
			let i = document.createElement("button");
			i.className = "p-gui__tab-button", r === n && (i.className += " p-gui__tab-button--active"), i.textContent = e, i.id = "p-gui-tab-" + O(), i.setAttribute("role", "tab"), i.setAttribute("aria-selected", String(r === n)), i.setAttribute("tabindex", r === n ? "0" : "-1"), c.append(i);
			let a = document.createElement("div");
			a.className = "p-gui__tab-pane", a.id = "p-gui-tabpanel-" + O(), a.setAttribute("role", "tabpanel"), a.setAttribute("aria-labelledby", i.id), i.setAttribute("aria-controls", a.id), r === n && (a.className += " p-gui__tab-pane--active"), l.append(a);
			let o = new A({
				container: s,
				wrapper: a,
				parent: this,
				firstParent: this.firstParent
			});
			u.push({
				gui: o,
				button: i,
				pane: a
			}), i.addEventListener("click", () => {
				d(r);
			}), i.addEventListener("keydown", (e) => {
				let n = null;
				if (e.key === "ArrowRight") n = (r + 1) % t.length;
				else if (e.key === "ArrowLeft") n = (r - 1 + t.length) % t.length;
				else if (e.key === "Home") n = 0;
				else if (e.key === "End") n = t.length - 1;
				else return;
				e.preventDefault(), d(n), u[n].button.focus();
			});
		});
		function d(e) {
			u.forEach((e) => {
				e.button.classList.remove("p-gui__tab-button--active"), e.pane.classList.remove("p-gui__tab-pane--active"), e.button.setAttribute("aria-selected", "false"), e.button.setAttribute("tabindex", "-1");
			});
			let t = u[e];
			t.button.classList.add("p-gui__tab-button--active"), t.pane.classList.add("p-gui__tab-pane--active"), t.button.setAttribute("aria-selected", "true"), t.button.setAttribute("tabindex", "0");
		}
		let f = new A({
			container: s,
			wrapper: u[n]?.pane || document.createElement("div"),
			parent: this,
			firstParent: this.firstParent
		});
		return f.getTab = (e) => u[e]?.gui || null, f.getTabElement = (e) => u[e]?.button || null, f.setActiveTab = (e) => {
			e >= 0 && e < u.length && u[e].button.click();
		}, f.getActiveTab = () => u.findIndex((e) => e.button.classList.contains("p-gui__tab-button--active")), f.element = s, this.tabsArray.push(f), f;
	}
	_makeDraggable() {
		!this.domElement || !this.header || this.header.addEventListener("pointerdown", this._onPointerDown);
	}
	toggleClose() {
		this.domElement && (this.closed = !this.closed, this.closed ? (this.previousInnerScroll = this.wrapper.scrollTop, this.wrapper.scrollTo(0, 0)) : this.wrapper.scrollTo(0, this.previousInnerScroll), this.domElement.classList.toggle("p-gui--collapsed"), this.closeBtn?.setAttribute("aria-expanded", String(!this.closed)));
	}
	kill() {
		this.autoRepositioning && window.removeEventListener("resize", this._boundHandleResize), this.domElement &&= (this.domElement.remove(), null);
	}
	_mapLinear(e, t, n, r, i) {
		return r + (e - t) * (i - r) / (n - t);
	}
	_countDecimals(e) {
		let t = e.toString(), n = t.indexOf(".");
		return n === -1 ? 0 : t.length - n - 1;
	}
}, A = class extends k {
	constructor(e) {
		super({}, !0), this.isFolder = !0, this.domElement = e.container, this.wrapper = e.wrapper, this.parent = e.parent, this.firstParent = e.firstParent;
	}
};
//#endregion
export { d as Angle, e as Button, s as Color, A as Folder, i as Image, o as List, p as NumberInput, r as Slider, f as Text, a as Toggle, c as Vector2, k as default };
