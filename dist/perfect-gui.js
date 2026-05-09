class S {
  constructor(t, e = {}) {
    if (this.parent = t, this.callback = null, typeof e != "object")
      throw Error(
        `[GUI] button() first parameter must be an object. Received: ${typeof e}.`
      );
    let r = e.label || " ";
    const d = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? r : null, i = document.createElement("div");
    i.className = "p-gui__button", i.textContent = r, d && i.setAttribute("title", d), i.addEventListener("click", () => {
      this.callback && this.callback(), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), typeof e.color == "string" && (i.style.setProperty("--color-accent", e.color), i.style.setProperty(
      "--color-accent-hover",
      e.hoverColor || e.color
    )), this.parent.wrapper.append(i), this.element = i;
  }
  onClick(t) {
    return this.callback = t, this;
  }
}
class Y {
  constructor(t, e, r, d) {
    this.parent = t, this.propReferences = [];
    let i = {}, l = null;
    if (e && typeof e == "object" && typeof r == "string")
      this.obj = e, this.prop = r, this.isObject = !0, i = d || {}, this.callback = null;
    else if (e && typeof e == "object")
      this.isObject = !1, i = e, l = typeof i.value == "number" ? i.value : null;
    else
      throw Error("[GUI] slider() invalid parameters.");
    let c = typeof i.label == "string" && i.label || " ";
    this.isObject && c == " " && (c = this.prop), this.min = i.min ?? 0, this.max = i.max ?? 1, this.step = i.step || (this.max - this.min) / 100, this.decimals = this.parent._countDecimals(this.step);
    let n = null;
    this.isObject ? n = this.propReferences.push(this.obj[this.prop]) - 1 : l === null && (l = (this.max - this.min) / 2);
    const o = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? c : null, a = document.createElement("div");
    a.className = "p-gui__slider", o && a.setAttribute("title", o), this.parent.wrapper.append(a), this.element = a;
    const h = document.createElement("div");
    h.className = "p-gui__slider-name", h.textContent = c, a.append(h), this.ctrlDiv = document.createElement("div"), this.ctrlDiv.className = "p-gui__slider-ctrl", this.ctrlDiv.setAttribute("type", "range"), this.ctrlDiv.setAttribute("min", this.min), this.ctrlDiv.setAttribute("max", this.max), a.append(this.ctrlDiv);
    const p = document.createElement("div");
    p.className = "p-gui__slider-bar", this.ctrlDiv.append(p), this.handle = document.createElement("div"), this.handle.className = "p-gui__slider-handle", this.ctrlDiv.append(this.handle), this.filling = document.createElement("div"), this.filling.className = "p-gui__slider-filling", p.append(this.filling), this.valueInput = document.createElement("input"), this.valueInput.className = "p-gui__slider-value", this.valueInput.value = this.isObject ? this.obj[this.prop] : l, a.append(this.valueInput), setTimeout(() => {
      const s = this.ctrlDiv.offsetWidth, f = this.handle.offsetWidth;
      this.handle.position = this._mapLinear(
        this.valueInput.value,
        this.min,
        this.max,
        f / 2,
        s - f / 2
      ), this.handle.position = Math.min(
        this.handle.position,
        s - f / 2
      ), this.handle.position = Math.max(
        this.handle.position,
        f / 2
      ), this.handle.style.transform = `translate(-50%, -50%) translateX(${this.handle.position}px)`, this.filling.style.width = `${this.handle.position}px`;
    }, 0), this.valueInput.addEventListener("change", () => {
      this._updateHandlePositionFromValue(), this._triggerCallbacks();
    }), this.ctrlDiv.addEventListener("pointerdown", (s) => {
      this.ctrlDiv.pointerDown = !0, this.ctrlDiv.prevPosition = s.clientX, this._updateHandlePositionFromPointer(s, !0);
    }), window.addEventListener("pointerup", (s) => {
      this.ctrlDiv.pointerDown = !1;
    }), window.addEventListener("pointercancel", (s) => {
      this.ctrlDiv.pointerDown = !1;
    }), window.addEventListener("pointermove", (s) => {
      this.ctrlDiv.pointerDown && (this.ctrlDiv.pointerDelta = s.clientX - this.ctrlDiv.prevPosition, this._updateHandlePositionFromPointer(s));
    }), this.isObject && Object.defineProperty(this.obj, this.prop, {
      set: (s) => {
        this.propReferences[n] = s, this.valueInput.value = s, this._updateHandlePositionFromValue(), this.callback && this.callback(parseFloat(this.valueInput.value));
      },
      get: () => this.propReferences[n]
    });
  }
  _updateHandlePositionFromPointer(t, e = !1) {
    const r = this.ctrlDiv.getBoundingClientRect(), d = r.width, i = this.handle.offsetWidth, l = t.clientX - this.ctrlDiv.prevPosition, c = parseFloat(this.valueInput.value);
    let n;
    e ? n = t.clientX - r.left : n = this.handle.position + l, n = Math.max(
      i / 2,
      Math.min(n, d - i / 2)
    );
    let o = this.min + (this.max - this.min) * (n - i / 2) / (d - i);
    o > c ? o = this._quantizeFloor(o, this.step) : o = this._quantizeCeil(o, this.step), o = parseFloat(o.toFixed(9));
    const a = parseFloat((c + this.step).toFixed(9)), h = parseFloat((c - this.step).toFixed(9));
    (o >= a || o <= h) && (o = o.toFixed(this.decimals), this.valueInput.value = o, this.ctrlDiv.prevPosition = t.clientX, this.handle.style.transform = `translate(-50%, -50%) translateX(${n}px)`, this.handle.position = n, this.filling.style.width = this.handle.position + "px", this._triggerCallbacks());
  }
  _updateHandlePositionFromValue() {
    const t = this.ctrlDiv.offsetWidth, e = this.handle.offsetWidth;
    let r = this._mapLinear(
      this.valueInput.value,
      this.min,
      this.max,
      e / 2,
      t - e / 2
    );
    r = Math.max(
      e / 2,
      Math.min(r, t - e / 2)
    ), this.handle.style.transform = `translate(-50%, -50%) translateX(${r}px)`, this.handle.position = r, this.filling.style.width = this.handle.position + "px";
  }
  _triggerCallbacks() {
    this.isObject ? this.obj[this.prop] = parseFloat(this.valueInput.value) : this.callback && this.callback(parseFloat(this.valueInput.value)), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
  }
  _mapLinear(t, e, r, d, i) {
    return d + (t - e) * (i - d) / (r - e);
  }
  _quantize(t, e) {
    return e * Math.round(t / e);
  }
  _quantizeCeil(t, e) {
    return e * Math.ceil(t / e);
  }
  _quantizeFloor(t, e) {
    return e * Math.floor(t / e);
  }
  onChange(t) {
    return this.callback = t, this;
  }
}
class z {
  constructor(t, e = {}) {
    if (this.parent = t, this.callback = null, typeof e != "object")
      throw Error(
        `[GUI] image() first parameter must be an object. Received: ${typeof e}.`
      );
    let r;
    if (typeof e.path == "string")
      r = e.path;
    else
      throw typeof e.path == null ? Error("[GUI] image() path must be provided.") : Error("[GUI] image() path must be a string.");
    let d = r.replace(/^.*[\\\/]/, ""), i;
    e.label == null ? i = d : i = typeof e.label == "string" && e.label || " ";
    const l = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null, c = e.selected === !0, n = e.selectionBorder !== !1;
    let o = "";
    e.width && (typeof e.width == "number" && (e.width += "px"), o += `flex: 0 0 calc(${e.width} - 5px); `), e.height && (typeof e.height == "number" && (e.height += "px"), o += `height: ${e.height}; `);
    const a = document.createElement("div");
    a.className = "p-gui__image", a.style = "background-image: url(" + r + "); " + o, l && a.setAttribute("title", l), this.parent.imageContainer.append(a), this.element = a, c && n && a.classList.add("p-gui__image--selected");
    const h = document.createElement("div");
    h.className = "p-gui__image-text", h.textContent = i, a.append(h), a.addEventListener("click", () => {
      let p = a.parentElement.querySelectorAll(
        ".p-gui__image--selected"
      );
      for (let s = 0; s < p.length; s++)
        p[s].classList.remove("p-gui__image--selected");
      n && a.classList.add("p-gui__image--selected"), typeof this.callback == "function" && this.callback({ path: r, text: i }), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    });
  }
  onClick(t) {
    return this.callback = t, this;
  }
}
class B {
  constructor(t, e, r, d) {
    this.parent = t, this.callback = null;
    let i = {}, l = null, c = !1, n, o;
    if (e && typeof e == "object" && typeof r == "string")
      n = e, o = r, c = !0, i = d || {};
    else if (e && typeof e == "object")
      c = !1, i = e, l = typeof i.value == "boolean" ? i.value : null;
    else
      throw Error("[GUI] toggle() invalid parameters.");
    let a = typeof i.label == "string" && i.label || " ", h = null;
    c && a == " " && (a = o), c && (h = this.parent.propReferences.push(n[o]) - 1);
    const p = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? a : null, s = document.createElement("div");
    s.textContent = a, s.className = "p-gui__toggle", p && s.setAttribute("title", p), this.parent.wrapper.append(s), this.element = s, s.addEventListener("click", (g) => {
      const u = g.target.childNodes[1];
      let m = !0;
      u.classList.contains("p-gui__toggle-checkbox--active") && (m = !1), u.classList.toggle("p-gui__toggle-checkbox--active"), c ? n[o] = m : typeof this.callback == "function" && this.callback(m), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    });
    let f = c ? n[o] ? " p-gui__toggle-checkbox--active" : "" : l ? " p-gui__toggle-checkbox--active" : "";
    const b = document.createElement("div");
    b.className = "p-gui__toggle-checkbox" + f, s.append(b), c && Object.defineProperty(n, o, {
      set: (g) => {
        this.parent.propReferences[h] = g, g ? b.classList.add(
          "p-gui__toggle-checkbox--active"
        ) : b.classList.remove(
          "p-gui__toggle-checkbox--active"
        ), typeof this.callback == "function" && this.callback(g);
      },
      get: () => this.parent.propReferences[h]
    });
  }
  onChange(t) {
    return this.callback = t, this;
  }
}
class T {
  constructor(t, e, r, d) {
    this.parent = t, this.callback = null;
    let i = {}, l = null, c = !1, n, o;
    if (e && typeof e == "object" && typeof r == "string")
      n = e, o = r, c = !0, i = d || {};
    else if (e && typeof e == "object")
      c = !1, i = e;
    else
      throw Error("[GUI] list() invalid parameters.");
    let a = typeof i.label == "string" ? i.label : " ", h = null, p = Array.isArray(i.values) ? i.values : null, s = p && p.length > 0 && typeof p[0] == "object";
    const f = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? a : null;
    c ? (l = (() => {
      if (!p)
        return null;
      if (typeof n[o] == "string")
        return s ? p.find((u) => u.value === n[o]).value : p.indexOf(n[o]);
      if (typeof n[o] == "number")
        return s ? p.find((u) => u.value === n[o]).value : n[o];
    })(), h = this.parent.propReferences.push(n[o]) - 1) : l = (() => {
      if (!p)
        return null;
      if (typeof i.value == "string")
        return p.indexOf(i.value);
      if (typeof i.value == "number")
        return i.value;
    })();
    let b = document.createElement("div");
    b.className = "p-gui__list", b.textContent = a, f && b.setAttribute("title", f), this.parent.wrapper.append(b), this.element = b;
    let g = document.createElement("select");
    b.append(g), g.className = "p-gui__list-dropdown", g.addEventListener("change", (u) => {
      c ? n[o] = u.target.value : this.callback && this.callback(u.target.value), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), p && p.forEach((u, m) => {
      const x = s ? u.label : u, w = s ? u.value : u;
      let y = document.createElement("option");
      y.setAttribute("value", w), y.textContent = x, g.append(y), (!s && l == m || s && l == w) && y.setAttribute("selected", "");
    }), c && Object.defineProperty(n, o, {
      set: (u) => {
        let m, x, w;
        s ? (w = p.find((U) => U.value == u), x = w?.value || p[0].value, m = p.indexOf(w)) : (typeof u == "string" && (m = p.indexOf(u), x = u), typeof u == "number" && (m = u, x = p[u])), this.parent.propReferences[h] = s ? x : u;
        const y = g.querySelector("[selected]");
        y && y.removeAttribute("selected"), g.querySelectorAll("option")[m].setAttribute("selected", ""), typeof this.callback == "function" && (s ? this.callback(w, m) : this.callback(x, m));
      },
      get: () => this.parent.propReferences[h]
    });
  }
  onChange(t) {
    return this.callback = t, this;
  }
}
class V {
  constructor(t, e, r, d) {
    this.parent = t, this.callback = null;
    let i = {}, l = null, c = !1, n, o;
    if (e && typeof e == "object" && typeof r == "string")
      n = e, o = r, c = !0, i = d || {};
    else if (e && typeof e == "object")
      c = !1, i = e;
    else
      throw Error("[GUI] color() invalid parameters.");
    let a = typeof i.label == "string" && i.label || " ", h = null;
    const p = typeof i.tooltip == "string" ? i.tooltip : i.tooltip === !0 ? a : null;
    c ? (a == " " && (a = o), h = this.parent.propReferences.push(n[o]) - 1, l = n[o] || "#000000") : (typeof i.value == "string" && (i.value.length != 7 || i.value[0] != "#" ? console.error(
      `[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${i.value}".`
    ) : l = i.value), l || (l = "#000000"));
    const s = document.createElement("div");
    s.className = "p-gui__color", s.textContent = a, p && s.setAttribute("title", p), this.parent.wrapper.append(s), this.element = s;
    const f = document.createElement("input");
    f.className = "p-gui__color-picker", f.setAttribute("type", "color"), f.value = l, s.append(f), f.addEventListener("input", () => {
      c ? n[o] = f.value : typeof this.callback == "function" && this.callback(f.value), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), c && Object.defineProperty(n, o, {
      set: (b) => {
        this.parent.propReferences[h] = b, f.value = b, typeof this.callback == "function" && this.callback(b);
      },
      get: () => this.parent.propReferences[h]
    });
  }
  onChange(t) {
    return this.callback = t, this;
  }
}
class G {
  constructor(t, e, r, d, i) {
    this.parent = t, this.callback = null;
    let l = {}, c, n, o, a;
    if (e && typeof e == "object" && typeof r == "string" && typeof d == "string")
      c = e, n = e, o = r, a = d, l = i || {};
    else if (e && typeof e == "object" && e.x && e.x.obj)
      l = e, c = l.x.obj, o = l.x.prop, n = l.y.obj, a = l.y.prop;
    else
      throw Error(
        "[GUI] vector2() invalid parameters. Use: gui.vector2(obj, 'propX', 'propY', params)"
      );
    let h = typeof l.label == "string" && l.label || " ";
    h === " " && (h = o + " / " + a);
    const p = l.x || {}, s = l.y || {}, f = p.min ?? l.min ?? 0, b = p.max ?? l.max ?? 1, g = s.min ?? l.min ?? 0, u = s.max ?? l.max ?? 1, m = p.step || l.step || (b - f) / 100, x = s.step || l.step || (u - g) / 100, w = this.parent._countDecimals(m), y = this.parent._countDecimals(x), U = this.parent.propReferences.push(c[o]) - 1, L = this.parent.propReferences.push(n[a]) - 1, D = typeof l.tooltip == "string" ? l.tooltip : l.tooltip === !0 ? h : null, A = document.createElement("div");
    A.className = "p-gui__vector2", A.textContent = h, D && A.setAttribute("title", D), this.parent.wrapper.append(A);
    const E = document.createElement("div");
    E.className = "p-gui__vector-value", E.textContent = c[o] + ", " + n[a], A.append(E);
    const _ = document.createElement("div");
    _.className = "p-gui__vector2-area", A.append(_), _.addEventListener("click", (v) => {
      const j = parseFloat(
        this.parent._mapLinear(
          v.offsetX,
          0,
          _.clientWidth,
          f,
          b
        )
      ), R = parseFloat(
        this.parent._mapLinear(
          v.offsetY,
          0,
          _.clientHeight,
          u,
          g
        )
      );
      c[o] = j.toFixed(w), n[a] = R.toFixed(y), this.callback && this.callback(c[o], c[a]), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    });
    const O = (v) => {
      const j = _.getBoundingClientRect(), R = v.clientX - j.left, H = v.clientY - j.top, M = this.parent._mapLinear(
        R,
        0,
        _.clientWidth,
        f,
        b
      ), X = this.parent._mapLinear(
        H,
        0,
        _.clientHeight,
        u,
        g
      ), $ = Math.max(f, Math.min(b, M)), W = Math.max(g, Math.min(u, X));
      c[o] = parseFloat($.toFixed(w)), n[a] = parseFloat(W.toFixed(y)), this.callback && this.callback(c[o], n[a]), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    };
    _.addEventListener("pointerdown", (v) => {
      O(v), document.addEventListener("pointermove", O), document.addEventListener(
        "pointerup",
        () => {
          document.removeEventListener(
            "pointermove",
            O
          );
        },
        { once: !0 }
      );
    });
    const N = document.createElement("div");
    N.className = "p-gui__vector2-line p-gui__vector2-line-x", _.append(N);
    const F = document.createElement("div");
    F.className = "p-gui__vector2-line p-gui__vector2-line-y", _.append(F);
    const I = document.createElement("div");
    I.className = "p-gui__vector2-dot", _.append(I);
    const P = () => {
      I.style.left = this.parent._mapLinear(
        c[o],
        f,
        b,
        0,
        _.clientWidth
      ) + "px", I.style.top = this.parent._mapLinear(
        n[a],
        g,
        u,
        _.clientHeight,
        0
      ) + "px";
    };
    P(), new ResizeObserver(() => {
      P();
    }).observe(_), Object.defineProperty(c, o, {
      set: (v) => {
        this.parent.propReferences[U] = v, P(), E.textContent = String(v) + ", " + n[a];
      },
      get: () => this.parent.propReferences[U]
    }), Object.defineProperty(n, a, {
      set: (v) => {
        this.parent.propReferences[L] = v, P(), E.textContent = c[o] + ", " + String(v);
      },
      get: () => this.parent.propReferences[L]
    });
  }
  onChange(t) {
    return this.callback = t, this;
  }
}
const Q = ".p-gui__button{background:var(--color-accent);text-align:center;color:var(--color-bg);border:1px solid transparent;box-sizing:border-box;transition:var(--transition) background,var(--transition) border-color}.p-gui__button:hover{background:var(--color-accent-hover);border-color:#fff3}.p-gui__folder .p-gui__button{margin-inline:0}", q = ".p-gui__slider{position:relative;min-height:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--color-text-dark);transition:color var(--transition);padding:3px;touch-action:none}.p-gui__slider:hover{color:var(--color-text-light)}.p-gui__slider-name{width:50%;text-overflow:ellipsis;overflow:hidden}.p-gui__slider-ctrl{-webkit-appearance:none;padding:0;font:inherit;outline:none;box-sizing:border-box;cursor:pointer;position:relative;right:0;height:14px;margin:0 0 0 auto;width:37%;touch-action:none}.p-gui__slider-bar{position:absolute;top:50%;left:0;height:2px;background:#fff3;width:100%;transform:translateY(-50%)}.p-gui__slider-filling{position:absolute;top:-25%;left:0;height:100%;background:var(--color-accent);width:0;pointer-events:none}.p-gui__slider:hover .p-gui__slider-filling{background:var(--color-accent-hover)}.p-gui__slider-handle{width:9px;height:9px;position:absolute;top:50%;left:0;border-radius:2px;transform:translate(-50%,-50%);pointer-events:none;background:var(--color-text-dark);box-shadow:0 0 2px #00000080}.p-gui__slider:hover .p-gui__slider-handle{background:var(--color-text-light)}.p-gui__slider-value{display:inline-block;right:7px;width:13%;border:none;color:#fff;border-radius:2px;background:#ffffff1a;padding:2px 4px;color:inherit}.p-gui__slider-value:focus{outline:none}", J = ".p-gui__list{cursor:default;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__list:hover{color:var(--color-text-light)}.p-gui__list-dropdown{background:#ffffff0d;color:#fff;padding:0 12px 0 5px;top:0}.p-gui__list-dropdown{position:absolute;right:5px;top:0;bottom:0;margin:auto;height:calc(100% - 4px);cursor:pointer;border-radius:3px;border:1px solid var(--color-border-2);outline:none}.p-gui__list-dropdown option{background:#fff;color:#000}.p-gui__list-dropdown:hover{background:#ffffff1a}", Z = ".p-gui__toggle{color:var(--color-text-dark);transition:var(--transition) background,var(--transition) color}.p-gui__toggle:hover{background:#ffffff1a;color:var(--color-text-light)}.p-gui__folder .p-gui__toggle{margin-inline:0}.p-gui__toggle-checkbox{width:10px;height:10px;background-color:#ffffff1a;position:absolute;top:0;right:10px;bottom:0;margin:auto;border-radius:2px;pointer-events:none;transition:.5s all ease}.p-gui__toggle-checkbox--active{background-color:#ddd;box-shadow:0 0 5px #ddd}", K = ".p-gui__color{cursor:default;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__color:hover{color:var(--color-text-light)}.p-gui__color-picker{position:absolute;right:5px;top:0;bottom:0;margin:auto;height:calc(100% - 4px);cursor:pointer;border-radius:3px;border:1px solid var(--color-border-2);outline:none;-webkit-appearance:none;padding:0;background-color:transparent;border:1px solid #222222;overflow:hidden}.p-gui__color-picker::-webkit-color-swatch-wrapper{padding:0}.p-gui__color-picker::-webkit-color-swatch{border:none}", ee = ".p-gui__vector2{background:transparent;aspect-ratio:1;padding-bottom:0;color:var(--color-text-dark)}.p-gui__vector2:hover{color:var(--color-text-light)}.p-gui__vector2-area{position:relative;background:#0000004d;margin-top:8px;width:100%;height:calc(100% - 28px);touch-action:none}.p-gui__vector2-line{position:absolute;background:#fff;opacity:.3;pointer-events:none}.p-gui__vector2-line-x{width:100%;height:1px;left:0;top:50%;transform:translateY(-50%)}.p-gui__vector2-line-y{width:1px;height:100%;top:0;left:50%;transform:translate(-50%)}.p-gui__vector2-dot{position:absolute;top:0;left:0;width:8px;height:8px;border-radius:50%;background:#d5d5d5;border:2px solid #ff9999;transform:translate(-50%,-50%);pointer-events:none}.p-gui__vector-value{display:inline-block;right:7px;position:absolute}", te = '.p-gui__image-container{width:100%;padding:3px;display:flex;justify-content:flex-start;flex-wrap:wrap;box-sizing:border-box}.p-gui__image{background-size:cover;cursor:pointer;position:relative;margin:1px 2.5px 19px;border-radius:var(--main-border-radius);flex:0 0 calc(33.333% - 5px);height:90px;background-position:center;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__image:hover{color:var(--color-text-light)}.p-gui__image:after{position:absolute;top:0;left:0;width:100%;height:100%;content:"";border:1px solid transparent;box-sizing:border-box;border-radius:var(--main-border-radius);transition:var(--transition) border-color}.p-gui__image--selected:after{border-color:#06ff89}.p-gui__image-text{position:absolute;bottom:-15px;text-shadow:0 -1px 0 #111;white-space:nowrap;width:100%;overflow:hidden;text-overflow:ellipsis}', ie = ".p-gui__folder{width:100%;position:relative;background:var(--color-bg);margin-bottom:2px;display:flex;flex-wrap:wrap;border:1px solid var(--color-border-2);border-radius:var(--main-border-radius);box-sizing:border-box;border-left:1px solid #bbbbbb}.p-gui__folder--first{margin-top:0}.p-gui__folder-content{display:grid;grid-template-rows:1fr;transition:.25s grid-template-rows ease;width:100%}.p-gui__folder-inner{overflow:hidden;padding-left:3px;padding-right:2px}.p-gui__folder--closed .p-gui__folder-content{grid-template-rows:0fr}.p-gui__folder-header{padding:5px 3px;background-color:#00000080;color:#fff;cursor:pointer;width:100%;box-sizing:border-box;border-top-right-radius:var(--main-border-radius);border-bottom-right-radius:var(--main-border-radius)}.p-gui__folder-header:hover{background-color:#000000bf}.p-gui__folder-arrow{width:8px;height:8px;display:inline-block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAHlBMVEUAAAD///////////////////////////////////8kfJuVAAAACXRSTlMA9Z1fCdMo1yxEJnA0AAAAK0lEQVQI12PABlRgjKkJUMZMYRhjpgqMAZSEMICSaIzpDWiKhdENhEhgAgATSg5jyWnYewAAAABJRU5ErkJggg==);background-size:contain;margin-right:5px;transform:rotate(90deg)}.p-gui__folder--closed .p-gui__folder-arrow{transform:rotate(0)}", re = ".p-gui__tabs{width:100%;position:relative;background:var(--color-bg);margin-bottom:2px;border:1px solid var(--color-border-2);border-radius:var(--main-border-radius);box-sizing:border-box;border-left:1px solid #bbbbbb;padding-block:0}.p-gui__tabs--first{margin-top:0}.p-gui__tabs-header{display:flex;background-color:#00000080;border-top-left-radius:var(--main-border-radius);border-top-right-radius:var(--main-border-radius)}.p-gui__tab-button{padding:7px 10px;background:transparent;color:#bbb;cursor:pointer;border:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;font-family:inherit}.p-gui__tab-button:last-child{border-right:none}.p-gui__tab-button:hover{color:#fff}.p-gui__tab-button--active{background-color:var(--color-bg);color:#fff;border-bottom:1px solid transparent}.p-gui__tabs-content{position:relative;width:100%}.p-gui__tab-pane{display:none;width:100%;padding-top:4px;box-sizing:border-box}.p-gui__tab-pane--active{display:block}";
function oe(k) {
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
    
        position: ${k};
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
    
    ${Q}
    
    ${te}
    
    ${J}
    
    ${Z}

    ${q}
    
    ${K}
    
    ${ee}
    
    ${ie}
    
    ${re}
`;
}
class C {
  constructor(t = {}) {
    if (this.firstParent = this, t.container ? (this.container = typeof t.container == "string" ? document.querySelector(t.container) : t.container, this.position_type = "absolute") : (this.container = document.body, this.position_type = "fixed"), this.propReferences = [], this.folders = [], this.tabsArray = [], t.isFolder) {
      this._folderConstructor(t.folderOptions);
      return;
    }
    typeof t.onUpdate == "function" && (this.onUpdate = t.onUpdate), this.label = t != null && typeof t.label == "string" ? t.label : "", this.backgroundColor = t.color || null, this.opacity = t.opacity || 1, this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(
      this.container.clientHeight,
      window.innerHeight
    ), t.maxHeight && (this.initMaxHeight = t.maxHeight, this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.screenCorner = this._parseScreenCorner(t.position), window.perfectGUI || (window.perfectGUI = {}), window.perfectGUI.instanceCounter == null ? window.perfectGUI.instanceCounter = 0 : window.perfectGUI.instanceCounter++, this.instanceId = window.perfectGUI.instanceCounter, this.wrapperWidth = t.width || 290, this.stylesheet = document.createElement("style"), this.stylesheet.setAttribute("type", "text/css"), this.stylesheet.setAttribute("id", "lm-gui-stylesheet"), document.head.append(this.stylesheet), this.instanceId == 0 && this._addStyles(`${oe(this.position_type)}`), this._styleInstance(), this.closed = !!t.closed, this._addWrapper(), this.domElement.setAttribute("data-corner-x", this.screenCorner.x), this.domElement.setAttribute("data-corner-y", this.screenCorner.y), t.autoRepositioning != !1 && window.addEventListener("resize", this._handleResize.bind(this)), this._handleResize(), this.hasBeenDragged = !1, t.draggable == !0 && this._makeDraggable();
  }
  _styleInstance() {
    let t = this._getScrollbarWidth(this.container);
    if (this.screenCorner.x == "left" ? this.xOffset = 0 : this.xOffset = this.container.clientWidth - this.wrapperWidth - t, this.instanceId > 0) {
      let e = this.container.querySelectorAll(".p-gui");
      for (let r = 0; r < e.length; r++)
        this.screenCorner.y == e[r].dataset.cornerY && (this.screenCorner.x == "left" && e[r].dataset.cornerX == "left" ? this.xOffset += e[r].offsetWidth : this.screenCorner.x == "right" && e[r].dataset.cornerX == "right" && (this.xOffset -= e[r].offsetWidth));
    }
    this.yOffset = 0, this.position = {
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
  _folderConstructor(t) {
    this.domElement = t.wrapper, this.isFolder = !0, this.parent = t.parent, this.firstParent = t.firstParent, this.wrapper = t.inner;
  }
  _parseScreenCorner(t) {
    let e = { x: "right", y: "top" };
    return t == null || (typeof t != "string" && console.error("[perfect-gui] Position must be a string."), t.includes("left") && (e.x = "left"), t.includes("bottom") && (e.y = "bottom")), e;
  }
  _getScrollbarWidth(t) {
    return t === document.body ? window.innerWidth - document.documentElement.clientWidth : t.offsetWidth - t.clientWidth;
  }
  _handleResize() {
    if (this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(
      this.container.clientHeight,
      window.innerHeight
    ), this.initMaxHeight && (this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.wrapper.style.maxHeight = this.maxHeight + "px", this.hasBeenDragged)
      return;
    let t = this._getScrollbarWidth(this.container);
    if (this.xOffset = this.screenCorner.x == "left" ? 0 : this.container.clientWidth - this.wrapperWidth - t, this.instanceId > 0) {
      let e = this.container.querySelectorAll(
        `.p-gui:not(#${this.domElement.id}):not([data-dragged])`
      );
      for (let r = 0; r < e.length && !(parseInt(
        e[r].id.replace("p-gui-", "")
      ) > this.instanceId); r++)
        this.screenCorner.y == e[r].dataset.cornerY && (this.screenCorner.x == "left" && e[r].dataset.cornerX == "left" ? this.xOffset += e[r].offsetWidth : this.screenCorner.x == "right" && e[r].dataset.cornerX == "right" && (this.xOffset -= e[r].offsetWidth));
    }
    this.position = {
      prevX: this.xOffset,
      prevY: this.yOffset,
      x: this.xOffset,
      y: this.yOffset
    }, this.domElement.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
  }
  _addStyles(t) {
    this.stylesheet.innerHTML += t;
  }
  _addWrapper() {
    this.domElement = document.createElement("div"), this.domElement.id = "p-gui-" + this.instanceId, this.domElement.className = "p-gui" + (this.closed ? " p-gui--collapsed" : ""), this.domElement.setAttribute("data-lenis-prevent", ""), this.container.append(this.domElement), this.header = document.createElement("div"), this.header.className = "p-gui__header", this.header.textContent = this.label, this.header.style = `${this.backgroundColor ? "border-color: " + this.backgroundColor + ";" : ""}`, this.domElement.append(this.header);
    const t = document.createElement("div");
    t.className = "p-gui__header-close", t.addEventListener("click", this.toggleClose.bind(this)), this.header.append(t);
    const e = document.createElement("div");
    e.className = "p-gui__content", this.domElement.append(e), this.wrapper = document.createElement("div"), this.wrapper.className = "p-gui__inner", e.append(this.wrapper);
  }
  button(t = {}) {
    return this.imageContainer = null, new S(this, t);
  }
  image(t = {}) {
    return this.imageContainer || (this.imageContainer = document.createElement("div"), this.imageContainer.className = "p-gui__image-container", this.wrapper.append(this.imageContainer)), new z(this, t);
  }
  slider(t, e, r) {
    return this.imageContainer = null, new Y(this, t, e, r);
  }
  toggle(t, e, r) {
    return this.imageContainer = null, new B(this, t, e, r);
  }
  list(t, e, r) {
    return this.imageContainer = null, new T(this, t, e, r);
  }
  color(t, e, r) {
    return this.imageContainer = null, new V(this, t, e, r);
  }
  vector2(t, e, r, d) {
    return this.imageContainer = null, new G(this, t, e, r, d);
  }
  folder(t = {}) {
    let e = typeof t.closed == "boolean" ? t.closed : !1, r = t.label || "", d = t.color || null, i = t.maxHeight || null;
    this.imageContainer = null;
    let l = "p-gui__folder";
    this.folders.length == 0 && (l += " p-gui__folder--first"), e && (l += " p-gui__folder--closed");
    let c = d ? `background-color: ${d};` : "";
    c += i ? `max-height: ${i}px; overflow-y: auto;` : "";
    const n = document.createElement("div");
    n.className = l, n.style = c, this.wrapper.append(n);
    const o = document.createElement("div");
    o.innerHTML = `<span class="p-gui__folder-arrow"></span>${r}`, o.className = "p-gui__folder-header", n.append(o);
    const a = document.createElement("div");
    a.className = "p-gui__folder-content", n.append(a);
    const h = document.createElement("div");
    h.className = "p-gui__folder-inner", a.append(h), o.addEventListener("click", () => {
      n.classList.toggle("p-gui__folder--closed");
    });
    let p = new C({
      isFolder: !0,
      folderOptions: {
        wrapper: n,
        inner: h,
        parent: this,
        firstParent: this.firstParent
      }
    });
    return this.folders.push(p), p;
  }
  tabs(t = {}) {
    const e = Array.isArray(t.tabs) ? t.tabs : [], r = t.active || 0, d = t.color || null, i = t.maxHeight || null;
    this.imageContainer = null;
    let l = "p-gui__tabs";
    this.tabsArray.length == 0 && (l += " p-gui__tabs--first");
    let c = d ? `background-color: ${d};` : "";
    c += i ? `max-height: ${i}px; overflow-y: auto;` : "";
    const n = document.createElement("div");
    n.className = l, n.style = c, this.wrapper.append(n);
    const o = document.createElement("div");
    o.className = "p-gui__tabs-header", n.append(o);
    const a = document.createElement("div");
    a.className = "p-gui__tabs-content", n.append(a);
    const h = [];
    e.forEach((s, f) => {
      const b = typeof s == "string" ? s : s.label || `Tab ${f + 1}`, g = document.createElement("button");
      g.className = "p-gui__tab-button", f === r && (g.className += " p-gui__tab-button--active"), g.textContent = b, o.append(g);
      const u = document.createElement("div");
      u.className = "p-gui__tab-pane", f === r && (u.className += " p-gui__tab-pane--active"), a.append(u);
      const m = new C({
        isFolder: !0,
        folderOptions: {
          wrapper: n,
          inner: u,
          parent: this,
          firstParent: this.firstParent
        }
      });
      h.push({
        gui: m,
        button: g,
        pane: u
      }), g.addEventListener("click", () => {
        h.forEach((x) => {
          x.button.classList.remove("p-gui__tab-button--active"), x.pane.classList.remove("p-gui__tab-pane--active");
        }), g.classList.add("p-gui__tab-button--active"), u.classList.add("p-gui__tab-pane--active");
      });
    });
    const p = new C({
      isFolder: !0,
      folderOptions: {
        wrapper: n,
        inner: h[r]?.pane || document.createElement("div"),
        parent: this,
        firstParent: this.firstParent
      }
    });
    return p.getTab = (s) => h[s]?.gui || null, p.getTabElement = (s) => h[s]?.button || null, p.setActiveTab = (s) => {
      s >= 0 && s < h.length && h[s].button.click();
    }, p.getActiveTab = () => h.findIndex(
      (s) => s.button.classList.contains("p-gui__tab-button--active")
    ), p.element = n, this.tabsArray.push(p), p;
  }
  _makeDraggable() {
    var t = this;
    this.header.addEventListener("pointerdown", e), this.header.addEventListener("pointerup", d);
    function e(i) {
      i.preventDefault(), t.position.initX = t.position.x, t.position.initY = t.position.y, t.position.prevX = i.clientX, t.position.prevY = i.clientY, document.addEventListener("pointermove", r);
    }
    function r(i) {
      i.preventDefault(), t.hasBeenDragged || (t.hasBeenDragged = !0, t.domElement.setAttribute("data-dragged", "true")), t.position.x = t.position.initX + i.clientX - t.position.prevX, t.position.y = t.position.initY + i.clientY - t.position.prevY, t.domElement.style.transform = "translate3d(" + t.position.x + "px," + t.position.y + "px,0)";
    }
    function d(i) {
      document.removeEventListener("pointermove", r);
    }
  }
  toggleClose() {
    this.closed = !this.closed, this.closed ? (this.previousInnerScroll = this.wrapper.scrollTop, this.wrapper.scrollTo(0, 0)) : this.wrapper.scrollTo(0, this.previousInnerScroll), this.domElement.classList.toggle("p-gui--collapsed");
  }
  kill() {
    this.domElement.remove();
  }
  _mapLinear(t, e, r, d, i) {
    return d + (t - e) * (i - d) / (r - e);
  }
  _countDecimals(t) {
    const e = t.toString(), r = e.indexOf(".");
    return r === -1 ? 0 : e.length - r - 1;
  }
  static registerPlugin(t) {
    for (let e in t)
      C.prototype[e] = t[e];
  }
}
export {
  C as default
};
