//#region src/components/Button.ts
var e = class {
	constructor(e, t = {}) {
		if (this.callback = null, this.parent = e, typeof t != "object") throw Error(`[GUI] button() first parameter must be an object. Received: ${typeof t}.`);
		let n = t.label || "\xA0", r = typeof t.tooltip == "string" ? t.tooltip : t.tooltip === !0 ? n : null, i = document.createElement("div");
		i.className = "p-gui__button", i.textContent = n, r && i.setAttribute("title", r), i.addEventListener("click", () => {
			this.callback && this.callback(), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		}), typeof t.color == "string" && (i.style.setProperty("--color-accent", t.color), i.style.setProperty("--color-accent-hover", t.hoverColor || t.color)), this.parent.wrapper.append(i), this.element = i;
	}
	onClick(e) {
		return this.callback = e, this;
	}
}, t = class {
	constructor(e, t, n, r = {}) {
		if (this.callback = null, this.parent = e, this.propReferences = [], t && typeof t == "object" && typeof n == "string") this.obj = t, this.prop = n;
		else throw Error("[GUI] slider() invalid parameters.");
		let i = typeof r.label == "string" && r.label || "\xA0";
		i == "\xA0" && (i = this.prop), this.min = r.min ?? 0, this.max = r.max ?? 1, this.step = r.step || (this.max - this.min) / 100, this.decimals = this.parent._countDecimals(this.step);
		let a = this.propReferences.push(this.obj[this.prop]) - 1, o = typeof r.tooltip == "string" ? r.tooltip : r.tooltip === !0 ? i : null, s = document.createElement("div");
		s.className = "p-gui__slider", o && s.setAttribute("title", o), this.parent.wrapper.append(s), this.element = s;
		let c = document.createElement("div");
		c.className = "p-gui__slider-name", c.textContent = i, s.append(c), this.ctrlDiv = document.createElement("div"), this.ctrlDiv.prevPosition = 0, this.ctrlDiv.className = "p-gui__slider-ctrl", this.ctrlDiv.setAttribute("type", "range"), this.ctrlDiv.setAttribute("min", String(this.min)), this.ctrlDiv.setAttribute("max", String(this.max)), s.append(this.ctrlDiv);
		let l = document.createElement("div");
		l.className = "p-gui__slider-bar", this.ctrlDiv.append(l), this.handle = document.createElement("div"), this.handle.className = "p-gui__slider-handle", this.ctrlDiv.append(this.handle), this.filling = document.createElement("div"), this.filling.className = "p-gui__slider-filling", l.append(this.filling), this.valueInput = document.createElement("input"), this.valueInput.className = "p-gui__slider-value", this.valueInput.value = this.obj[this.prop], s.append(this.valueInput), setTimeout(() => {
			let e = this.ctrlDiv.offsetWidth, t = this.handle.offsetWidth;
			this.handle.position = this.parent._mapLinear(parseFloat(this.valueInput.value), this.min, this.max, t / 2, e - t / 2), this.handle.position = Math.min(this.handle.position, e - t / 2), this.handle.position = Math.max(this.handle.position, t / 2), this.handle.style.transform = `translate(-50%, -50%) translateX(${this.handle.position}px)`, this.filling.style.width = `${this.handle.position}px`;
		}, 0), this.valueInput.addEventListener("change", () => {
			this._updateHandlePositionFromValue(), this._triggerCallbacks();
		}), this.ctrlDiv.addEventListener("pointerdown", (e) => {
			this.ctrlDiv.pointerDown = !0, this.ctrlDiv.prevPosition = e.clientX, this._updateHandlePositionFromPointer(e, !0);
		}), window.addEventListener("pointerup", () => {
			this.ctrlDiv.pointerDown = !1;
		}), window.addEventListener("pointercancel", () => {
			this.ctrlDiv.pointerDown = !1;
		}), window.addEventListener("pointermove", (e) => {
			this.ctrlDiv.pointerDown && (this.ctrlDiv.pointerDelta = e.clientX - (this.ctrlDiv.prevPosition ?? 0), this._updateHandlePositionFromPointer(e));
		}), Object.defineProperty(this.obj, this.prop, {
			set: (e) => {
				this.propReferences[a] = e, this.valueInput.value = e, this._updateHandlePositionFromValue(), this.callback && this.callback(parseFloat(this.valueInput.value));
			},
			get: () => this.propReferences[a]
		});
	}
	_updateHandlePositionFromPointer(e, t = !1) {
		let n = this.ctrlDiv.getBoundingClientRect(), r = n.width, i = this.handle.offsetWidth, a = e.clientX - (this.ctrlDiv.prevPosition ?? 0), o = parseFloat(this.valueInput.value), s;
		s = t ? e.clientX - n.left : (this.handle.position ?? 0) + a, s = Math.max(i / 2, Math.min(s, r - i / 2));
		let c = this.min + (this.max - this.min) * (s - i / 2) / (r - i);
		c = c > o ? this._quantizeFloor(c, this.step) : this._quantizeCeil(c, this.step), c = parseFloat(c.toFixed(9));
		let l = parseFloat((o + this.step).toFixed(9)), u = parseFloat((o - this.step).toFixed(9));
		(c >= l || c <= u) && (c = parseFloat(c.toFixed(this.decimals)), this.valueInput.value = String(c), this.ctrlDiv.prevPosition = e.clientX, this.handle.style.transform = `translate(-50%, -50%) translateX(${s}px)`, this.handle.position = s, this.filling.style.width = this.handle.position + "px", this._triggerCallbacks());
	}
	_updateHandlePositionFromValue() {
		let e = this.ctrlDiv.offsetWidth, t = this.handle.offsetWidth, n = this.parent._mapLinear(parseFloat(this.valueInput.value), this.min, this.max, t / 2, e - t / 2);
		n = Math.max(t / 2, Math.min(n, e - t / 2)), this.handle.style.transform = `translate(-50%, -50%) translateX(${n}px)`, this.handle.position = n, this.filling.style.width = this.handle.position + "px";
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
}, n = class {
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
		l.className = "p-gui__image", l.style = "background-image: url(" + t + "); " + c, a && l.setAttribute("title", a), this.parent.imageContainer.append(l), this.element = l, o && s && l.classList.add("p-gui__image--selected");
		let u = document.createElement("div");
		u.className = "p-gui__image-text", u.textContent = i, l.append(u), l.addEventListener("click", () => {
			let e = l.parentElement?.querySelectorAll(".p-gui__image--selected") || [];
			for (let t = 0; t < e.length; t++) e[t].classList.remove("p-gui__image--selected");
			s && l.classList.add("p-gui__image--selected"), typeof this.callback == "function" && this.callback({
				path: t,
				text: i
			}), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		});
	}
	onClick(e) {
		return this.callback = e, this;
	}
}, r = class {
	constructor(e, t, n, r = {}) {
		if (this.parent = e, this.callback = null, !t || typeof t != "object" || typeof n != "string") throw Error("[GUI] toggle() invalid parameters.");
		let i = typeof r.label == "string" && r.label !== "" ? r.label : n, a = this.parent.propReferences.push(t[n]) - 1, o = typeof r.tooltip == "string" ? r.tooltip : r.tooltip === !0 ? i : null, s = document.createElement("div");
		s.textContent = i, s.className = "p-gui__toggle", o && s.setAttribute("title", o), this.parent.wrapper.append(s), this.element = s;
		let c = t[n] ? " p-gui__toggle-checkbox--active" : "", l = document.createElement("div");
		l.className = "p-gui__toggle-checkbox" + c, s.append(l), s.addEventListener("click", (e) => {
			if (!e.target || !(e.target instanceof HTMLElement)) return;
			let r = !0;
			l.classList.contains("p-gui__toggle-checkbox--active") && (r = !1), l.classList.toggle("p-gui__toggle-checkbox--active"), t[n] = r, this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		}), Object.defineProperty(t, n, {
			set: (e) => {
				this.parent.propReferences[a] = e, e ? l.classList.add("p-gui__toggle-checkbox--active") : l.classList.remove("p-gui__toggle-checkbox--active"), typeof this.callback == "function" && this.callback(e);
			},
			get: () => this.parent.propReferences[a]
		});
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, i = class {
	constructor(e, t, n, r, i = {}) {
		if (this.parent = e, this.callback = null, !t || typeof t != "object" || typeof n != "string") throw Error("[GUI] list() invalid parameters.");
		let a = typeof i.label == "string" ? i.label : n, o = Array.isArray(r) ? r : null;
		if (!o) throw Error("[GUI] list() Third argument must be an array.");
		let s = o && o.length > 0 && typeof o[0] == "object", c = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? a : null, l = (() => {
			if (!o) return null;
			if (typeof t[n] == "string") return s ? o.find((e) => e.value === t[n])?.value : o.indexOf(t[n]);
			if (typeof t[n] == "number") return s ? o.find((e) => e.value === t[n])?.value : t[n];
		})(), u = this.parent.propReferences.push(t[n]) - 1, d = document.createElement("div");
		d.className = "p-gui__list", d.textContent = a, c && d.setAttribute("title", c), this.parent.wrapper.append(d), this.element = d;
		let f = document.createElement("select");
		d.append(f), f.className = "p-gui__list-dropdown", f.addEventListener("change", (e) => {
			t[n] = e.target.value, this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		}), o && o.forEach((e, t) => {
			let n = s ? e.label : e, r = s ? e.value : e, i = document.createElement("option");
			i.setAttribute("value", String(r)), i.textContent = String(n), f.append(i), (!s && l == t || s && l == r) && i.setAttribute("selected", "");
		}), Object.defineProperty(t, n, {
			set: (e) => {
				let t, n, r;
				if (s) {
					if (r = o?.find((t) => t.value == e), !r) {
						console.error(`[GUI] list() value ${e} not found in values`);
						return;
					}
					n = r?.value || o[0].value, t = o.indexOf(r);
				} else typeof e == "string" && (t = o.indexOf(e), n = e), typeof e == "number" && (t = e, n = o[e]);
				if (t === void 0 || n === void 0) {
					console.error("[GUI] list() newIndex or newValue is undefined");
					return;
				}
				this.parent.propReferences[u] = s ? n : e;
				let i = f.querySelector("[selected]");
				i && i.removeAttribute("selected"), f.querySelectorAll("option")[t].setAttribute("selected", ""), typeof this.callback == "function" && (s && r ? this.callback(r, t) : this.callback(n, t));
			},
			get: () => this.parent.propReferences[u]
		});
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, a = class {
	constructor(e, t, n, r = {}) {
		if (this.callback = null, this.parent = e, typeof t != "object" || typeof n != "string") throw Error("[GUI] color() invalid parameters. Expected (object, string, options).");
		let i = typeof r.label == "string" && r.label || "\xA0";
		i === "\xA0" && (i = n);
		let a = typeof r.tooltip == "string" ? r.tooltip : r.tooltip === !0 ? i : null, o = this.parent.propReferences.push(t[n]) - 1, s = t[n] || "#000000", c = document.createElement("div");
		c.className = "p-gui__color", c.textContent = i, a && c.setAttribute("title", a), this.parent.wrapper.append(c), this.element = c;
		let l = document.createElement("input");
		l.className = "p-gui__color-picker", l.setAttribute("type", "color"), l.value = s, c.append(l), l.addEventListener("input", () => {
			t[n] = l.value, this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		}), Object.defineProperty(t, n, {
			set: (e) => {
				this.parent.propReferences[o] = e, l.value = e, typeof this.callback == "function" && this.callback(e);
			},
			get: () => this.parent.propReferences[o]
		});
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, o = class {
	constructor(e, t, n, r, i = {}) {
		this.parent = e, this.callback = null;
		let a, o;
		if (t && typeof t == "object" && typeof n == "string" && typeof r == "string") a = t, o = t, n = n, r = r;
		else throw Error("[GUI] vector2() invalid parameters. Use: gui.vector2(obj, 'propX', 'propY', options)");
		let s = typeof i.label == "string" && i.label || "\xA0";
		s === "\xA0" && (s = n + " / " + r);
		let c = i.x || {}, l = i.y || {}, u = c.min ?? i.min ?? 0, d = c.max ?? i.max ?? 1, f = l.min ?? i.min ?? 0, p = l.max ?? i.max ?? 1, m = c.step || i.step || (d - u) / 100, h = l.step || i.step || (p - f) / 100, g = this.parent._countDecimals(m), _ = this.parent._countDecimals(h), v = this.parent.propReferences.push(a[n]) - 1, y = this.parent.propReferences.push(o[r]) - 1, b = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? s : null, x = document.createElement("div");
		x.className = "p-gui__vector2", x.textContent = s, b && x.setAttribute("title", b), this.parent.wrapper.append(x);
		let S = document.createElement("div");
		S.className = "p-gui__vector-value", S.textContent = a[n] + ", " + o[r], x.append(S);
		let C = document.createElement("div");
		C.className = "p-gui__vector2-area", x.append(C), C.addEventListener("click", (e) => {
			let t = this.parent._mapLinear(e.offsetX, 0, C.clientWidth, u, d), i = this.parent._mapLinear(e.offsetY, 0, C.clientHeight, p, f), s = Math.max(u, Math.min(d, t)), c = Math.max(f, Math.min(p, i));
			a[n] = parseFloat(s.toFixed(g)), o[r] = parseFloat(c.toFixed(_)), this.callback && this.callback(a[n], o[r]), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		});
		let w = (e) => {
			let t = C.getBoundingClientRect(), i = e.clientX - t.left, s = e.clientY - t.top, c = this.parent._mapLinear(i, 0, C.clientWidth, u, d), l = this.parent._mapLinear(s, 0, C.clientHeight, p, f), m = Math.max(u, Math.min(d, c)), h = Math.max(f, Math.min(p, l));
			a[n] = parseFloat(m.toFixed(g)), o[r] = parseFloat(h.toFixed(_)), this.callback && this.callback(a[n], o[r]), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
		};
		C.addEventListener("pointerdown", (e) => {
			w(e), document.addEventListener("pointermove", w), document.addEventListener("pointerup", () => {
				document.removeEventListener("pointermove", w);
			}, { once: !0 });
		});
		let T = document.createElement("div");
		T.className = "p-gui__vector2-line p-gui__vector2-line-x", C.append(T);
		let E = document.createElement("div");
		E.className = "p-gui__vector2-line p-gui__vector2-line-y", C.append(E);
		let D = document.createElement("div");
		D.className = "p-gui__vector2-dot", C.append(D);
		let O = () => {
			D.style.left = this.parent._mapLinear(a[n], u, d, 0, C.clientWidth) + "px", D.style.top = this.parent._mapLinear(o[r], f, p, C.clientHeight, 0) + "px";
		};
		O(), new ResizeObserver(() => {
			O();
		}).observe(C), Object.defineProperty(a, n, {
			set: (e) => {
				this.parent.propReferences[v] = e, O(), S.textContent = String(e) + ", " + o[r];
			},
			get: () => this.parent.propReferences[v]
		}), Object.defineProperty(o, r, {
			set: (e) => {
				this.parent.propReferences[y] = e, O(), S.textContent = a[n] + ", " + String(e);
			},
			get: () => this.parent.propReferences[y]
		});
	}
	onChange(e) {
		return this.callback = e, this;
	}
}, s = ".p-gui__button{background:var(--color-accent);text-align:center;color:var(--color-bg);box-sizing:border-box;transition:var(--transition) background, var(--transition) border-color;border:1px solid #0000}.p-gui__button:hover{background:var(--color-accent-hover);border-color:#fff3}.p-gui__folder .p-gui__button{margin-inline:0}", c = ".p-gui__slider{min-height:14px;color:var(--color-text-dark);transition:color var(--transition);touch-action:none;justify-content:space-between;align-items:center;gap:10px;padding:3px;display:flex;position:relative}.p-gui__slider:hover{color:var(--color-text-light)}.p-gui__slider-name{text-overflow:ellipsis;width:50%;overflow:hidden}.p-gui__slider-ctrl{-webkit-appearance:none;font:inherit;box-sizing:border-box;cursor:pointer;touch-action:none;outline:none;width:37%;height:14px;margin:0 0 0 auto;padding:0;position:relative;right:0}.p-gui__slider-bar{background:#fff3;width:100%;height:2px;position:absolute;top:50%;left:0;transform:translateY(-50%)}.p-gui__slider-filling{background:var(--color-accent);pointer-events:none;width:0;height:100%;position:absolute;top:-25%;left:0}.p-gui__slider:hover .p-gui__slider-filling{background:var(--color-accent-hover)}.p-gui__slider-handle{pointer-events:none;background:var(--color-text-dark);border-radius:2px;width:9px;height:9px;position:absolute;top:50%;left:0;transform:translate(-50%,-50%);box-shadow:0 0 2px #00000080}.p-gui__slider:hover .p-gui__slider-handle{background:var(--color-text-light)}.p-gui__slider-value{color:inherit;width:13%;background:#ffffff1a;border:none;border-radius:2px;padding:2px 4px;display:inline-block;right:7px}.p-gui__slider-value:focus{outline:none}", l = ".p-gui__list{cursor:default;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__list:hover{color:var(--color-text-light)}.p-gui__list-dropdown{color:#fff;background:#ffffff0d;padding:0 12px 0 5px;top:0}.p-gui__list-dropdown{cursor:pointer;border:1px solid var(--color-border-2);border-radius:3px;outline:none;height:calc(100% - 4px);margin:auto;position:absolute;top:0;bottom:0;right:5px}.p-gui__list-dropdown option{color:#000;background:#fff}.p-gui__list-dropdown:hover{background:#ffffff1a}", u = ".p-gui__toggle{color:var(--color-text-dark);transition:var(--transition) background, var(--transition) color}.p-gui__toggle:hover{color:var(--color-text-light);background:#ffffff1a}.p-gui__folder .p-gui__toggle{margin-inline:0}.p-gui__toggle-checkbox{box-sizing:border-box;pointer-events:none;background-color:#ffffff1a;border:1px solid #ffffff26;border-radius:999px;width:26px;height:14px;margin:auto;transition:background-color .2s,border-color .2s;position:absolute;top:0;bottom:0;right:10px}.p-gui__toggle-checkbox:before{content:\"\";background-color:#ddd;border-radius:50%;width:10px;height:10px;transition:transform .2s,background-color .2s;position:absolute;top:50%;left:1px;transform:translateY(-50%)}.p-gui__toggle-checkbox--active{background-color:var(--color-accent);border-color:var(--color-accent)}.p-gui__toggle-checkbox--active:before{background-color:var(--color-text-light);box-shadow:0 0 4px var(--color-accent-hover);transform:translate(12px,-50%)}", d = ".p-gui__color{cursor:default;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__color:hover{color:var(--color-text-light)}.p-gui__color-picker{cursor:pointer;border:1px solid var(--color-border-2);-webkit-appearance:none;background-color:#0000;border:1px solid #222;border-radius:3px;outline:none;height:calc(100% - 4px);margin:auto;padding:0;position:absolute;top:0;bottom:0;right:5px;overflow:hidden}.p-gui__color-picker::-webkit-color-swatch-wrapper{padding:0}.p-gui__color-picker::-webkit-color-swatch{border:none}", f = ".p-gui__vector2{aspect-ratio:1;color:var(--color-text-dark);background:0 0;padding-bottom:0}.p-gui__vector2:hover{color:var(--color-text-light)}.p-gui__vector2-area{touch-action:none;background:#0000004d;width:100%;height:calc(100% - 28px);margin-top:8px;position:relative}.p-gui__vector2-line{opacity:.3;pointer-events:none;background:#fff;position:absolute}.p-gui__vector2-line-x{width:100%;height:1px;top:50%;left:0;transform:translateY(-50%)}.p-gui__vector2-line-y{width:1px;height:100%;top:0;left:50%;transform:translate(-50%)}.p-gui__vector2-dot{pointer-events:none;background:#d5d5d5;border:2px solid #f99;border-radius:50%;width:8px;height:8px;position:absolute;top:0;left:0;transform:translate(-50%,-50%)}.p-gui__vector-value{display:inline-block;position:absolute;right:7px}", p = ".p-gui__image-container{box-sizing:border-box;flex-wrap:wrap;justify-content:flex-start;width:100%;padding:3px;display:flex}.p-gui__image{cursor:pointer;border-radius:var(--main-border-radius);height:90px;color:var(--color-text-dark);transition:var(--transition) color;background-position:50%;background-size:cover;flex:0 0 calc(33.333% - 5px);margin:1px 2.5px 19px;position:relative}.p-gui__image:hover{color:var(--color-text-light)}.p-gui__image:after{content:\"\";box-sizing:border-box;border-radius:var(--main-border-radius);width:100%;height:100%;transition:var(--transition) border-color;border:1px solid #0000;position:absolute;top:0;left:0}.p-gui__image--selected:after{border-color:#06ff89}.p-gui__image-text{text-shadow:0 -1px #111;white-space:nowrap;text-overflow:ellipsis;width:100%;position:absolute;bottom:-15px;overflow:hidden}", m = ".p-gui__folder{background:var(--color-bg);border:1px solid var(--color-border-2);border-radius:var(--main-border-radius);box-sizing:border-box;border-left:1px solid #bbb;flex-wrap:wrap;width:100%;margin-bottom:2px;display:flex;position:relative}.p-gui__folder--first{margin-top:0}.p-gui__folder-content{grid-template-rows:1fr;width:100%;transition:grid-template-rows .25s;display:grid}.p-gui__folder-inner{padding-left:3px;padding-right:2px;overflow:hidden}.p-gui__folder--closed .p-gui__folder-content{grid-template-rows:0fr}.p-gui__folder-header{color:#fff;cursor:pointer;box-sizing:border-box;border-top-right-radius:var(--main-border-radius);border-bottom-right-radius:var(--main-border-radius);background-color:#00000080;width:100%;padding:5px 3px}.p-gui__folder-header:hover{background-color:#000000bf}.p-gui__folder-arrow{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAHlBMVEUAAAD///////////////////////////////////8kfJuVAAAACXRSTlMA9Z1fCdMo1yxEJnA0AAAAK0lEQVQI12PABlRgjKkJUMZMYRhjpgqMAZSEMICSaIzpDWiKhdENhEhgAgATSg5jyWnYewAAAABJRU5ErkJggg==);background-size:contain;width:8px;height:8px;margin-right:5px;display:inline-block;transform:rotate(90deg)}.p-gui__folder--closed .p-gui__folder-arrow{transform:rotate(0)}", h = ".p-gui__tabs{background:var(--color-bg);border:1px solid var(--color-border-2);border-radius:var(--main-border-radius);box-sizing:border-box;border-left:1px solid #bbb;width:100%;margin-bottom:2px;padding-block:0;position:relative}.p-gui__tabs--first{margin-top:0}.p-gui__tabs-header{border-top-left-radius:var(--main-border-radius);border-top-right-radius:var(--main-border-radius);background-color:#00000080;display:flex}.p-gui__tab-button{color:#bbb;cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:none;flex:1;padding:7px 10px;font-family:inherit;overflow:hidden}.p-gui__tab-button:last-child{border-right:none}.p-gui__tab-button:hover{color:#fff}.p-gui__tab-button--active{background-color:var(--color-bg);color:#fff;border-bottom:1px solid #0000}.p-gui__tabs-content{width:100%;position:relative}.p-gui__tab-pane{box-sizing:border-box;width:100%;padding-top:4px;display:none}.p-gui__tab-pane--active{display:block}";
//#endregion
//#region src/styles/styles.ts
function g(e) {
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
    .p-gui__color,
    .p-gui__tabs {
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
    .p-gui__color:hover,
    .p-gui__tabs:hover {
        border-color: rgba(255,255,255,.2);
    }   
    
    ${s}
    
    ${p}
    
    ${l}
    
    ${u}

    ${c}
    
    ${d}
    
    ${f}
    
    ${m}
    
    ${h}
`;
}
//#endregion
//#region src/index.ts
var _ = class {
	constructor(e = {}, t = !1) {
		if (this.container = document.body, this.label = "", this.backgroundColor = null, this.opacity = 1, this.maxHeight = window.innerHeight, this.initMaxHeight = null, this.instanceId = 0, this.wrapperWidth = 290, this.stylesheet = null, this.closed = !1, this.domElement = null, this.hasBeenDragged = !1, this.xOffset = 0, this.yOffset = 0, this.position = {
			initX: 0,
			initY: 0,
			prevX: 0,
			prevY: 0,
			x: 0,
			y: 0
		}, this.isFolder = !1, this.parent = null, this.imageContainer = null, this.previousInnerScroll = 0, this.onUpdate = null, this._onPointerDown = (e) => {
			e.preventDefault(), this.position.initX = this.position.x, this.position.initY = this.position.y, this.position.prevX = e.clientX, this.position.prevY = e.clientY, this.container.addEventListener("pointermove", this._onPointerMove), document.addEventListener("pointerup", this._onPointerUp);
		}, this._onPointerMove = (e) => {
			e.preventDefault(), this.hasBeenDragged || (this.hasBeenDragged = !0, this.domElement?.setAttribute("data-dragged", "true")), this.position.x = this.position.initX + e.clientX - this.position.prevX, this.position.y = this.position.initY + e.clientY - this.position.prevY, this.domElement && (this.domElement.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`);
		}, this._onPointerUp = () => {
			this.container.removeEventListener("pointermove", this._onPointerMove), document.removeEventListener("pointerup", this._onPointerUp);
		}, this.firstParent = this, this.folders = [], this.tabsArray = [], this.propReferences = [], e.isFolder) {
			this._folderConstructor(e.folderOptions);
			return;
		}
		if (t) return;
		let n = "fixed";
		if (e.container) {
			let t = typeof e.container == "string" ? document.querySelector(e.container) : e.container;
			t instanceof HTMLElement && (this.container = t, n = "absolute");
		}
		this.screenCorner = this._parseScreenCorner(e.position), e.width && (this.wrapperWidth = e.width), typeof e.onUpdate == "function" && (this.onUpdate = e.onUpdate), this.label = typeof e.label == "string" ? e.label : "", this.backgroundColor = e.color || null, this.opacity = e.opacity || 1, this.container && this.container !== document.body && (this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight)), e.maxHeight && (this.initMaxHeight = e.maxHeight, this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), window.perfectGUI || (window.perfectGUI = {}), window.perfectGUI.instanceCounter == null ? window.perfectGUI.instanceCounter = 0 : window.perfectGUI.instanceCounter++, this.instanceId = window.perfectGUI.instanceCounter, this.stylesheet = document.createElement("style"), this.stylesheet.setAttribute("type", "text/css"), this.stylesheet.setAttribute("id", "lm-gui-stylesheet"), document.head.append(this.stylesheet), this.instanceId == 0 && this._addStyles(`${g(n)}`), this._styleInstance(), this.closed = !!e.closed;
		let [r, i] = this._addWrapper();
		this.domElement = r, this.wrapper = i, this.domElement.setAttribute("data-corner-x", this.screenCorner.x), this.domElement.setAttribute("data-corner-y", this.screenCorner.y), e.autoRepositioning != 0 && window.addEventListener("resize", this._handleResize.bind(this)), this._handleResize(), e.draggable == 1 && this._makeDraggable();
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
		if (!this.domElement || (this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight), this.initMaxHeight && (this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.wrapper.style.maxHeight = this.maxHeight + "px", this.hasBeenDragged)) return;
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
		t.className = "p-gui__header-close", t.addEventListener("click", this.toggleClose.bind(this)), this.header.append(t);
		let n = document.createElement("div");
		n.className = "p-gui__content", e.append(n);
		let r = document.createElement("div");
		return r.className = "p-gui__inner", n.append(r), [e, r];
	}
	button(t = {}) {
		return this.imageContainer = null, new e(this, t);
	}
	image(e, t = {}) {
		return this.imageContainer || (this.imageContainer = document.createElement("div"), this.imageContainer.className = "p-gui__image-container", this.wrapper.append(this.imageContainer)), new n(this, e, t);
	}
	slider(e, n, r = {}) {
		return this.imageContainer = null, new t(this, e, n, r);
	}
	toggle(e, t, n = {}) {
		return this.imageContainer = null, new r(this, e, t, n);
	}
	list(e, t, n, r = {}) {
		return this.imageContainer = null, new i(this, e, t, n, r);
	}
	color(e, t, n = {}) {
		return this.imageContainer = null, new a(this, e, t, n);
	}
	vector2(e, t, n, r = {}) {
		return this.imageContainer = null, new o(this, e, t, n, r);
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
		l.className = "p-gui__folder-content", s.append(l);
		let u = document.createElement("div");
		u.className = "p-gui__folder-inner", l.append(u), c.addEventListener("click", () => {
			s.classList.toggle("p-gui__folder--closed");
		});
		let d = new v({
			container: s,
			wrapper: u,
			parent: this,
			firstParent: this.firstParent
		});
		return this.folders.push(d), d;
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
		c.className = "p-gui__tabs-header", s.append(c);
		let l = document.createElement("div");
		l.className = "p-gui__tabs-content", s.append(l);
		let u = [];
		t.forEach((e, t) => {
			let r = document.createElement("button");
			r.className = "p-gui__tab-button", t === n && (r.className += " p-gui__tab-button--active"), r.textContent = e, c.append(r);
			let i = document.createElement("div");
			i.className = "p-gui__tab-pane", t === n && (i.className += " p-gui__tab-pane--active"), l.append(i);
			let a = new v({
				container: s,
				wrapper: i,
				parent: this,
				firstParent: this.firstParent
			});
			u.push({
				gui: a,
				button: r,
				pane: i
			}), r.addEventListener("click", () => {
				u.forEach((e) => {
					e.button.classList.remove("p-gui__tab-button--active"), e.pane.classList.remove("p-gui__tab-pane--active");
				}), r.classList.add("p-gui__tab-button--active"), i.classList.add("p-gui__tab-pane--active");
			});
		});
		let d = new v({
			container: s,
			wrapper: u[n]?.pane || document.createElement("div"),
			parent: this,
			firstParent: this.firstParent
		});
		return d.getTab = (e) => u[e]?.gui || null, d.getTabElement = (e) => u[e]?.button || null, d.setActiveTab = (e) => {
			e >= 0 && e < u.length && u[e].button.click();
		}, d.getActiveTab = () => u.findIndex((e) => e.button.classList.contains("p-gui__tab-button--active")), d.element = s, this.tabsArray.push(d), d;
	}
	_makeDraggable() {
		!this.domElement || !this.header || this.header.addEventListener("pointerdown", this._onPointerDown);
	}
	toggleClose() {
		this.domElement && (this.closed = !this.closed, this.closed ? (this.previousInnerScroll = this.wrapper.scrollTop, this.wrapper.scrollTo(0, 0)) : this.wrapper.scrollTo(0, this.previousInnerScroll), this.domElement.classList.toggle("p-gui--collapsed"));
	}
	kill() {
		this.domElement && this.domElement.remove();
	}
	_mapLinear(e, t, n, r, i) {
		return r + (e - t) * (i - r) / (n - t);
	}
	_countDecimals(e) {
		let t = e.toString(), n = t.indexOf(".");
		return n === -1 ? 0 : t.length - n - 1;
	}
}, v = class extends _ {
	constructor(e) {
		super({}, !0), this.isFolder = !0, this.domElement = e.container, this.wrapper = e.wrapper, this.parent = e.parent, this.firstParent = e.firstParent;
	}
};
//#endregion
export { v as Folder, _ as default };
