let M = class {
  constructor(t, e = {}, i) {
    this.parent = t;
    let s = "";
    typeof e != "string" ? typeof e == "object" && e?.hasOwnProperty("label") ? s = e.label == "" ? " " : e.label : s = " " : s = e == "" ? " " : e;
    const l = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null, a = document.createElement("div");
    return a.className = "p-gui__button", a.textContent = s, l && a.setAttribute("title", l), a.addEventListener("click", () => {
      i && i(), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), typeof e.color == "string" && (a.style.setProperty("--color-accent", e.color), a.style.setProperty("--color-accent-hover", e.hoverColor || e.color)), this.parent.wrapper.append(a), a;
  }
};
class N {
  constructor(t, e = {}, i) {
    if (this.parent = t, this.propReferences = [], typeof e != "object")
      throw Error(`[GUI] slider() first parameter must be an object. Received: ${typeof e}.`);
    let s = typeof e.label == "string" && e.label || " ";
    this.isObject = !1;
    let l = null;
    this.obj = e.obj, this.prop = e.prop;
    let a = typeof e.value == "number" ? e.value : null;
    if (this.min = e.min ?? 0, this.max = e.max ?? 1, this.step = e.step || (this.max - this.min) / 100, this.decimals = this.parent._countDecimals(this.step), this.callback = typeof i == "function" ? i : null, a !== null)
      (this.prop != null || this.obj != null) && console.warn('[GUI] slider() "obj" and "prop" parameters are ignored when a "value" parameter is used.');
    else if (this.prop != null && this.obj != null) {
      if (typeof this.prop != "string")
        throw Error(`[GUI] slider() "prop" parameter must be an string. Received: ${typeof this.prop}.`);
      if (typeof this.obj != "object")
        throw Error(`[GUI] slider() "obj" parameter must be an object. Received: ${typeof this.obj}.`);
      s == " " && (s = this.prop), l = this.propReferences.push(this.obj[this.prop]) - 1, this.isObject = !0;
    } else
      (this.prop != null && this.obj == null || this.prop == null && this.obj != null) && console.warn('[GUI] slider() "obj" and "prop" parameters must be used together.'), a = (this.max - this.min) / 2;
    const o = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null, r = document.createElement("div");
    r.className = "p-gui__slider", o && r.setAttribute("title", o), this.parent.wrapper.append(r);
    const d = document.createElement("div");
    d.className = "p-gui__slider-name", d.textContent = s, r.append(d), this.ctrlDiv = document.createElement("div"), this.ctrlDiv.className = "p-gui__slider-ctrl", this.ctrlDiv.setAttribute("type", "range"), this.ctrlDiv.setAttribute("min", this.min), this.ctrlDiv.setAttribute("max", this.max), r.append(this.ctrlDiv);
    const c = document.createElement("div");
    return c.className = "p-gui__slider-bar", this.ctrlDiv.append(c), this.handle = document.createElement("div"), this.handle.className = "p-gui__slider-handle", this.ctrlDiv.append(this.handle), this.filling = document.createElement("div"), this.filling.className = "p-gui__slider-filling", c.append(this.filling), this.valueInput = document.createElement("input"), this.valueInput.className = "p-gui__slider-value", this.valueInput.value = this.isObject ? this.obj[this.prop] : a, r.append(this.valueInput), setTimeout(() => {
      const n = this.handle.offsetWidth;
      this.handle.position = this._mapLinear(this.valueInput.value, this.min, this.max, n / 2, 88 - n / 2), this.handle.position = Math.min(this.handle.position, 88 - n / 2), this.handle.position = Math.max(this.handle.position, n / 2), this.handle.style.transform = `translate(-50%, -50%) translateX(${this.handle.position}px)`, this.filling.style.width = `${this.handle.position}px`;
    }, 0), this.valueInput.addEventListener("change", () => {
      this._updateHandlePositionFromValue(), this._triggerCallbacks();
    }), this.ctrlDiv.addEventListener("pointerdown", (n) => {
      this.ctrlDiv.pointerDown = !0, this.ctrlDiv.prevPosition = n.clientX, this._updateHandlePositionFromPointer(n, !0);
    }), window.addEventListener("pointerup", (n) => {
      this.ctrlDiv.pointerDown = !1;
    }), window.addEventListener("pointermove", (n) => {
      this.ctrlDiv.pointerDown && (this.ctrlDiv.pointerDelta = n.clientX - this.ctrlDiv.prevPosition, this._updateHandlePositionFromPointer(n));
    }), this.isObject && Object.defineProperty(this.obj, this.prop, {
      set: (n) => {
        this.propReferences[l] = n, this.valueInput.value = n, this._updateHandlePositionFromValue(), this.callback && this.callback(parseFloat(this.valueInput.value));
      },
      get: () => this.propReferences[l]
    }), r;
  }
  _updateHandlePositionFromPointer(t, e = !1) {
    const i = this.ctrlDiv.offsetWidth, s = this.handle.offsetWidth, l = t.clientX - this.ctrlDiv.prevPosition, a = parseFloat(this.valueInput.value);
    let o;
    e ? o = t.offsetX : o = this.handle.position + l, o = Math.max(s / 2, Math.min(o, i - s / 2));
    let r = this.min + (this.max - this.min) * (o - s / 2) / (i - s);
    r > a ? r = this._quantizeFloor(r, this.step) : r = this._quantizeCeil(r, this.step), r = parseFloat(r.toFixed(9));
    const d = parseFloat((a + this.step).toFixed(9)), c = parseFloat((a - this.step).toFixed(9));
    (r >= d || r <= c) && (r = r.toFixed(this.decimals), this.valueInput.value = r, this.ctrlDiv.prevPosition = t.clientX, this.handle.style.transform = `translate(-50%, -50%) translateX(${o}px)`, this.handle.position = o, this.filling.style.width = this.handle.position + "px", this._triggerCallbacks());
  }
  _updateHandlePositionFromValue() {
    const t = this.ctrlDiv.offsetWidth, e = this.handle.offsetWidth;
    let i = this._mapLinear(this.valueInput.value, this.min, this.max, e / 2, t - e / 2);
    i = Math.max(e / 2, Math.min(i, t - e / 2)), this.handle.style.transform = `translate(-50%, -50%) translateX(${i}px)`, this.handle.position = i, this.filling.style.width = this.handle.position + "px";
  }
  _triggerCallbacks() {
    this.isObject ? this.obj[this.prop] = parseFloat(this.valueInput.value) : this.callback && this.callback(parseFloat(this.valueInput.value)), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
  }
  _mapLinear(t, e, i, s, l) {
    return s + (t - e) * (l - s) / (i - e);
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
}
class H {
  constructor(t, e = {}, i) {
    if (this.parent = t, typeof e != "object")
      throw Error(`[GUI] image() first parameter must be an object. Received: ${typeof e}.`);
    let s;
    if (typeof e.path == "string")
      s = e.path;
    else
      throw typeof e.path == null ? Error("[GUI] image() path must be provided.") : Error("[GUI] image() path must be a string.");
    let l = s.replace(/^.*[\\\/]/, ""), a;
    e.label == null ? a = l : a = typeof e.label == "string" && e.label || " ";
    const o = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? a : null, r = e.selected === !0, d = e.selectionBorder !== !1;
    let c = "";
    e.width && (typeof e.width == "number" && (e.width += "px"), c += `flex: 0 0 calc(${e.width} - 5px); `), e.height && (typeof e.height == "number" && (e.height += "px"), c += `height: ${e.height}; `);
    const n = document.createElement("div");
    n.className = "p-gui__image", n.style = "background-image: url(" + s + "); " + c, o && n.setAttribute("title", o), this.parent.imageContainer.append(n), r && d && n.classList.add("p-gui__image--selected");
    const f = document.createElement("div");
    return f.className = "p-gui__image-text", f.textContent = a, n.append(f), n.addEventListener("click", () => {
      let p = n.parentElement.querySelectorAll(".p-gui__image--selected");
      for (let h = 0; h < p.length; h++)
        p[h].classList.remove("p-gui__image--selected");
      d && n.classList.add("p-gui__image--selected"), typeof i == "function" && i({ path: s, text: a }), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), n;
  }
}
class S {
  constructor(t, e = {}, i) {
    if (this.parent = t, typeof e != "object")
      throw Error(`[GUI] toggle() first parameter must be an object. Received: ${typeof e}.`);
    let s = typeof e.label == "string" && e.label || " ", l = !1, a = null, o = e.obj, r = e.prop, d = typeof e.value == "boolean" ? e.value : null;
    if (d !== null)
      (r != null || o != null) && console.warn('[GUI] toggle() "obj" and "prop" parameters are ignored when a "value" parameter is used.');
    else if (r != null && o != null) {
      if (typeof r != "string")
        throw Error(`[GUI] toggle() "prop" parameter must be an string. Received: ${typeof r}.`);
      if (typeof o != "object")
        throw Error(`[GUI] toggle() "obj" parameter must be an object. Received: ${typeof o}.`);
      s == " " && (s = r), a = this.parent.propReferences.push(o[r]) - 1, l = !0;
    } else
      (r != null && o == null || r == null && o == null) && console.warn('[GUI] toggle() "obj" and "prop" parameters must be used together.');
    const c = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null, n = document.createElement("div");
    n.textContent = s, n.className = "p-gui__toggle", c && n.setAttribute("title", c), n.addEventListener("click", (h) => {
      const u = h.target.childNodes[1];
      let g = !0;
      u.classList.contains("p-gui__toggle-checkbox--active") && (g = !1), u.classList.toggle("p-gui__toggle-checkbox--active"), l ? o[r] = g : typeof i == "function" && i(g), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    });
    let f = l ? o[r] ? " p-gui__toggle-checkbox--active" : "" : d ? " p-gui__toggle-checkbox--active" : "";
    const p = document.createElement("div");
    return p.className = "p-gui__toggle-checkbox" + f, n.append(p), l && Object.defineProperty(o, r, {
      set: (h) => {
        this.parent.propReferences[a] = h, h ? p.classList.add("p-gui__toggle-checkbox--active") : p.classList.remove("p-gui__toggle-checkbox--active"), typeof i == "function" && i(h);
      },
      get: () => this.parent.propReferences[a]
    }), n;
  }
}
class X {
  constructor(t, e = {}, i) {
    if (this.parent = t, typeof e != "object")
      throw Error(`[GUI] list() first parameter must be an object. Received: ${typeof e}.`);
    let s = typeof e.label == "string" ? e.label : " ", l = !1, a = null, o = e.obj, r = e.prop, d = Array.isArray(e.values) ? e.values : null, c, n = typeof d[0] != "string";
    const f = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null;
    if (i = typeof i == "function" ? i : null, e.value !== void 0 || e.value === void 0 && o === void 0 && r === void 0)
      (r != null || o != null) && console.warn('[GUI] list() "obj" and "prop" parameters are ignored when a "value" parameter is used.'), c = (() => {
        if (!d)
          return null;
        if (typeof e.value == "string")
          return d.indexOf(e.value);
        if (typeof e.value == "number")
          return e.value;
      })();
    else if (r != null && o != null) {
      if (typeof r != "string")
        throw Error(`[GUI] list() "prop" parameter must be an string. Received: ${typeof r}.`);
      if (typeof o != "object")
        throw Error(`[GUI] list() "obj" parameter must be an object. Received: ${typeof o}.`);
      c = (() => {
        if (!d)
          return null;
        if (typeof o[r] == "string")
          return n ? d.find((u) => u.value === o[r]).value : d.indexOf(o[r]);
        if (typeof o[r] == "number")
          return n ? d.find((u) => u.value === o[r]).value : o[r];
      })(), a = this.parent.propReferences.push(o[r]) - 1, l = !0;
    } else
      (r != null && o == null || r == null && o == null) && console.warn('[GUI] list() "obj" and "prop" parameters must be used together.');
    let p = document.createElement("div");
    p.className = "p-gui__list", p.textContent = s, f && p.setAttribute("title", f), this.parent.wrapper.append(p);
    let h = document.createElement("select");
    return p.append(h), h.className = "p-gui__list-dropdown", h.addEventListener("change", (u) => {
      l ? o[r] = u.target.value : i && i(u.target.value), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), d && d.forEach((u, g) => {
      const b = n ? u.label : u, v = n ? u.value : u;
      let x = document.createElement("option");
      x.setAttribute("value", v), x.textContent = b, h.append(x), (!n && c == g || n && c == v) && x.setAttribute("selected", "");
    }), l && Object.defineProperty(o, r, {
      set: (u) => {
        let g, b, v;
        n ? (v = d.find((w) => w.value == u), b = v?.value || d[0].value, g = d.indexOf(v)) : (typeof u == "string" && (g = d.indexOf(u), b = u), typeof u == "number" && (g = u, b = d[u])), this.parent.propReferences[a] = n ? b : u;
        const x = h.querySelector("[selected]");
        x && x.removeAttribute("selected"), h.querySelectorAll("option")[g].setAttribute("selected", ""), typeof i == "function" && i(n ? v : b, g);
      },
      get: () => this.parent.propReferences[a]
    }), p;
  }
}
class W {
  constructor(t, e = {}, i) {
    if (this.parent = t, typeof e != "object")
      throw Error(`[GUI] color() first parameter must be an object. Received: ${typeof e}.`);
    let s = typeof e.label == "string" && e.label || " ", l = !1, a = null, o = e.obj, r = e.prop, d;
    const c = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null;
    if (typeof e.value == "string" && (e.value.length != 7 || e.value[0] != "#" ? console.error(`[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${e.value}".`) : d = e.value), d || (d = "#000000"), e.value !== void 0)
      (r != null || o != null) && console.warn('[GUI] color() "obj" and "prop" parameters are ignored when a "value" parameter is used.');
    else if (r != null && o != null) {
      if (typeof r != "string")
        throw Error(`[GUI] color() "prop" parameter must be an string. Received: ${typeof r}.`);
      if (typeof o != "object")
        throw Error(`[GUI] color() "obj" parameter must be an object. Received: ${typeof o}.`);
      s == " " && (s = r), a = this.parent.propReferences.push(o[r]) - 1, l = !0;
    } else
      (r != null && o == null || r == null && o == null) && console.warn('[GUI] color() "obj" and "prop" parameters must be used together.');
    const n = document.createElement("div");
    n.className = "p-gui__color", n.textContent = s, c && n.setAttribute("title", c), this.parent.wrapper.append(n);
    const f = document.createElement("input");
    return f.className = "p-gui__color-picker", f.setAttribute("type", "color"), f.value = d, n.append(f), typeof i == "function" && f.addEventListener("input", () => {
      l ? o[r] = f.value : typeof i == "function" && i(f.value), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), l && Object.defineProperty(o, r, {
      set: (p) => {
        this.parent.propReferences[a] = p, f.value = p, typeof i == "function" && i(p);
      },
      get: () => this.parent.propReferences[a]
    }), n;
  }
}
class G {
  constructor(t, e = {}, i) {
    if (this.parent = t, typeof e != "object")
      throw Error(`[GUI] vector2() first parameter must be an object. Received: ${typeof e}.`);
    let s = typeof e.label == "string" && e.label || " ";
    const l = e.x.min ?? 0, a = e.x.max ?? 1, o = e.y.min ?? 0, r = e.y.max ?? 1, d = e.x.step || (a - l) / 100, c = e.y.step || (r - o) / 100, n = this.parent._countDecimals(d), f = this.parent._countDecimals(c), p = e.x.obj, h = e.x.prop, u = this.parent.propReferences.push(p[h]) - 1, g = e.y.obj, b = e.y.prop, v = this.parent.propReferences.push(g[b]) - 1, x = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null;
    i = typeof i == "function" ? i : null;
    const w = document.createElement("div");
    w.className = "p-gui__vector2", w.textContent = s, x && w.setAttribute("title", x), this.parent.wrapper.append(w);
    const A = document.createElement("div");
    A.className = "p-gui__vector-value", A.textContent = p[h] + ", " + g[b], w.append(A);
    const _ = document.createElement("div");
    _.className = "p-gui__vector2-area", w.append(_), _.addEventListener("click", (m) => {
      const U = parseFloat(this.parent._mapLinear(m.offsetX, 0, _.clientWidth, l, a)), I = parseFloat(this.parent._mapLinear(m.offsetY, 0, _.clientHeight, r, o));
      p[h] = U.toFixed(n), g[b] = I.toFixed(f), i && i(p[h], p[b]), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    });
    const j = (m) => {
      const U = _.getBoundingClientRect(), I = m.clientX - U.left, O = m.clientY - U.top, $ = this.parent._mapLinear(I, 0, _.clientWidth, l, a), D = this.parent._mapLinear(O, 0, _.clientHeight, r, o), L = Math.max(l, Math.min(a, $)), F = Math.max(o, Math.min(r, D));
      p[h] = parseFloat(L.toFixed(n)), g[b] = parseFloat(F.toFixed(f)), i && i(p[h], g[b]), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    };
    _.addEventListener("pointerdown", (m) => {
      j(m), document.addEventListener("pointermove", j), document.addEventListener("pointerup", () => {
        document.removeEventListener("pointermove", j);
      }, { once: !0 });
    });
    const R = document.createElement("div");
    R.className = "p-gui__vector2-line p-gui__vector2-line-x", _.append(R);
    const P = document.createElement("div");
    P.className = "p-gui__vector2-line p-gui__vector2-line-y", _.append(P);
    const E = document.createElement("div");
    E.className = "p-gui__vector2-dot", _.append(E);
    const k = () => {
      E.style.left = this.parent._mapLinear(p[h], l, a, 0, _.clientWidth) + "px", E.style.top = this.parent._mapLinear(g[b], o, r, _.clientHeight, 0) + "px";
    };
    return k(), new ResizeObserver(() => {
      k();
    }).observe(_), Object.defineProperty(p, h, {
      set: (m) => {
        this.parent.propReferences[u] = m, k(), A.textContent = String(m) + ", " + g[b];
      },
      get: () => this.parent.propReferences[u]
    }), Object.defineProperty(g, b, {
      set: (m) => {
        this.parent.propReferences[v] = m, k(), A.textContent = p[h] + ", " + String(m);
      },
      get: () => this.parent.propReferences[v]
    }), w;
  }
}
const Y = ".p-gui__button{background:var(--color-accent);text-align:center;color:var(--color-bg);border:1px solid transparent;box-sizing:border-box;transition:var(--transition) background,var(--transition) border-color}.p-gui__button:hover{background:var(--color-accent-hover);border-color:#fff3}.p-gui__folder .p-gui__button{margin-inline:0}", z = ".p-gui__slider{position:relative;min-height:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--color-text-dark);transition:color var(--transition);padding:3px}.p-gui__slider:hover{color:var(--color-text-light)}.p-gui__slider-name{width:50%;text-overflow:ellipsis;overflow:hidden}.p-gui__slider-ctrl{-webkit-appearance:none;padding:0;font:inherit;outline:none;box-sizing:border-box;cursor:pointer;position:relative;right:0;height:14px;margin:0 0 0 auto;width:37%}.p-gui__slider-bar{position:absolute;top:50%;left:0;height:2px;background:#fff3;width:100%;transform:translateY(-50%)}.p-gui__slider-filling{position:absolute;top:-25%;left:0;height:100%;background:var(--color-accent);width:0}.p-gui__slider:hover .p-gui__slider-filling{background:var(--color-accent-hover)}.p-gui__slider-handle{width:9px;height:9px;position:absolute;top:50%;left:0;border-radius:2px;transform:translate(-50%,-50%);pointer-events:none;background:var(--color-text-dark);box-shadow:0 0 2px #00000080}.p-gui__slider:hover .p-gui__slider-handle{background:var(--color-text-light)}.p-gui__slider-value{display:inline-block;right:7px;width:13%;border:none;color:#fff;border-radius:2px;background:#ffffff1a;padding:2px 4px;color:inherit}.p-gui__slider-value:focus{outline:none}", B = ".p-gui__list{cursor:default;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__list:hover{color:var(--color-text-light)}.p-gui__list-dropdown{background:#ffffff0d;color:#fff;padding:0 12px 0 5px;top:0}.p-gui__list-dropdown{position:absolute;right:5px;top:0;bottom:0;margin:auto;height:calc(100% - 4px);cursor:pointer;border-radius:3px;border:1px solid var(--color-border-2);outline:none}.p-gui__list-dropdown option{background:#fff;color:#000}.p-gui__list-dropdown:hover{background:#ffffff1a}", V = ".p-gui__toggle{color:var(--color-text-dark);transition:var(--transition) background,var(--transition) color}.p-gui__toggle:hover{background:#ffffff1a;color:var(--color-text-light)}.p-gui__folder .p-gui__toggle{margin-inline:0}.p-gui__toggle-checkbox{width:10px;height:10px;background-color:#ffffff1a;position:absolute;top:0;right:10px;bottom:0;margin:auto;border-radius:2px;pointer-events:none;transition:.5s all ease}.p-gui__toggle-checkbox--active{background-color:#ddd;box-shadow:0 0 5px #ddd}", T = ".p-gui__color{cursor:default;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__color:hover{color:var(--color-text-light)}.p-gui__color-picker{position:absolute;right:5px;top:0;bottom:0;margin:auto;height:calc(100% - 4px);cursor:pointer;border-radius:3px;border:1px solid var(--color-border-2);outline:none;-webkit-appearance:none;padding:0;background-color:transparent;border:1px solid #222222;overflow:hidden}.p-gui__color-picker::-webkit-color-swatch-wrapper{padding:0}.p-gui__color-picker::-webkit-color-swatch{border:none}", Q = ".p-gui__vector2{background:transparent;aspect-ratio:1;padding-bottom:0;color:var(--color-text-dark)}.p-gui__vector2:hover{color:var(--color-text-light)}.p-gui__vector2-area{position:relative;background:#0000004d;margin-top:8px;width:100%;height:calc(100% - 28px);touch-action:none}.p-gui__vector2-line{position:absolute;background:#fff;opacity:.3;pointer-events:none}.p-gui__vector2-line-x{width:100%;height:1px;left:0;top:50%;transform:translateY(-50%)}.p-gui__vector2-line-y{width:1px;height:100%;top:0;left:50%;transform:translate(-50%)}.p-gui__vector2-dot{position:absolute;top:0;left:0;width:8px;height:8px;border-radius:50%;background:#d5d5d5;border:2px solid #ff9999;transform:translate(-50%,-50%);pointer-events:none}.p-gui__vector-value{display:inline-block;right:7px;position:absolute}", q = '.p-gui__image-container{width:100%;padding:3px;display:flex;justify-content:flex-start;flex-wrap:wrap;box-sizing:border-box}.p-gui__image{background-size:cover;cursor:pointer;position:relative;margin:1px 2.5px 19px;border-radius:var(--main-border-radius);flex:0 0 calc(33.333% - 5px);height:90px;background-position:center;color:var(--color-text-dark);transition:var(--transition) color}.p-gui__image:hover{color:var(--color-text-light)}.p-gui__image:after{position:absolute;top:0;left:0;width:100%;height:100%;content:"";border:1px solid transparent;box-sizing:border-box;border-radius:var(--main-border-radius);transition:var(--transition) border-color}.p-gui__image--selected:after{border-color:#06ff89}.p-gui__image-text{position:absolute;bottom:-15px;text-shadow:0 -1px 0 #111;white-space:nowrap;width:100%;overflow:hidden;text-overflow:ellipsis}', J = ".p-gui__folder{width:100%;position:relative;background:var(--color-bg);margin-bottom:2px;display:flex;flex-wrap:wrap;border:1px solid var(--color-border-2);border-radius:var(--main-border-radius);box-sizing:border-box;border-left:1px solid #bbbbbb}.p-gui__folder--first{margin-top:0}.p-gui__folder-content{display:grid;grid-template-rows:1fr;transition:.25s grid-template-rows ease;width:100%}.p-gui__folder-inner{overflow:hidden;padding-left:3px;padding-right:2px}.p-gui__folder--closed .p-gui__folder-content{grid-template-rows:0fr}.p-gui__folder-header{padding:5px 3px;background-color:#00000080;color:#fff;cursor:pointer;width:100%;box-sizing:border-box;border-top-right-radius:var(--main-border-radius);border-bottom-right-radius:var(--main-border-radius)}.p-gui__folder-header:hover{background-color:#000000bf}.p-gui__folder-arrow{width:8px;height:8px;display:inline-block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAHlBMVEUAAAD///////////////////////////////////8kfJuVAAAACXRSTlMA9Z1fCdMo1yxEJnA0AAAAK0lEQVQI12PABlRgjKkJUMZMYRhjpgqMAZSEMICSaIzpDWiKhdENhEhgAgATSg5jyWnYewAAAABJRU5ErkJggg==);background-size:contain;margin-right:5px;transform:rotate(90deg)}.p-gui__folder--closed .p-gui__folder-arrow{transform:rotate(0)}";
function Z(y) {
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
    
        position: ${y};
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
    .p-gui__color {
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
    .p-gui__color:hover {
        border-color: rgba(255,255,255,.2);
    }   
    
    ${Y}
    
    ${q}
    
    ${B}
    
    ${V}

    ${z}
    
    ${T}
    
    ${Q}
    
    ${J}
`;
}
class C {
  constructor(t = {}) {
    if (this.firstParent = this, t.container ? (this.container = typeof t.container == "string" ? document.querySelector(t.container) : t.container, this.position_type = "absolute") : (this.container = document.body, this.position_type = "fixed"), this.propReferences = [], this.folders = [], t.isFolder) {
      this._folderConstructor(t.folderOptions);
      return;
    }
    typeof t.onUpdate == "function" && (this.onUpdate = t.onUpdate), this.label = t != null && typeof t.label == "string" ? t.label : "", this.backgroundColor = t.color || null, this.opacity = t.opacity || 1, this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(
      this.container.clientHeight,
      window.innerHeight
    ), t.maxHeight && (this.initMaxHeight = t.maxHeight, this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.screenCorner = this._parseScreenCorner(t.position), window.perfectGUI || (window.perfectGUI = {}), window.perfectGUI.instanceCounter == null ? window.perfectGUI.instanceCounter = 0 : window.perfectGUI.instanceCounter++, this.instanceId = window.perfectGUI.instanceCounter, this.wrapperWidth = t.width || 290, this.stylesheet = document.createElement("style"), this.stylesheet.setAttribute("type", "text/css"), this.stylesheet.setAttribute("id", "lm-gui-stylesheet"), document.head.append(this.stylesheet), this.instanceId == 0 && this._addStyles(`${Z(this.position_type)}`), this._styleInstance(), this._addWrapper(), this.wrapper.setAttribute("data-corner-x", this.screenCorner.x), this.wrapper.setAttribute("data-corner-y", this.screenCorner.y), t.autoRepositioning != !1 && window.addEventListener("resize", this._handleResize.bind(this)), this._handleResize(), this.hasBeenDragged = !1, t.draggable == !0 && this._makeDraggable(), this.closed = !1, t.closed && this.toggleClose();
  }
  _styleInstance() {
    let t = this._getScrollbarWidth(this.container);
    if (this.screenCorner.x == "left" ? this.xOffset = 0 : this.xOffset = this.container.clientWidth - this.wrapperWidth - t, this.instanceId > 0) {
      let e = this.container.querySelectorAll(".p-gui");
      for (let i = 0; i < e.length; i++)
        this.screenCorner.y == e[i].dataset.cornerY && (this.screenCorner.x == "left" && e[i].dataset.cornerX == "left" ? this.xOffset += e[i].offsetWidth : this.screenCorner.x == "right" && e[i].dataset.cornerX == "right" && (this.xOffset -= e[i].offsetWidth));
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
      for (let i = 0; i < e.length && !(parseInt(
        e[i].id.replace("p-gui-", "")
      ) > this.instanceId); i++)
        this.screenCorner.y == e[i].dataset.cornerY && (this.screenCorner.x == "left" && e[i].dataset.cornerX == "left" ? this.xOffset += e[i].offsetWidth : this.screenCorner.x == "right" && e[i].dataset.cornerX == "right" && (this.xOffset -= e[i].offsetWidth));
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
    this.domElement = document.createElement("div"), this.domElement.id = "p-gui-" + this.instanceId, this.domElement.className = "p-gui", this.domElement.setAttribute("data-lenis-prevent", ""), this.container.append(this.domElement), this.header = document.createElement("div"), this.header.className = "p-gui__header", this.header.textContent = this.label, this.header.style = `${this.backgroundColor ? "border-color: " + this.backgroundColor + ";" : ""}`, this.domElement.append(this.header);
    const t = document.createElement("div");
    t.className = "p-gui__header-close", t.addEventListener("click", this.toggleClose.bind(this)), this.header.append(t);
    const e = document.createElement("div");
    e.className = "p-gui__content", this.domElement.append(e), this.wrapper = document.createElement("div"), this.wrapper.className = "p-gui__inner", e.append(this.wrapper);
  }
  button(t = {}, e) {
    return this.imageContainer = null, new M(this, t, e);
  }
  image(t = {}, e) {
    return this.imageContainer || (this.imageContainer = document.createElement("div"), this.imageContainer.className = "p-gui__image-container", this.wrapper.append(this.imageContainer)), new H(this, t, e);
  }
  slider(t = {}, e) {
    return this.imageContainer = null, new N(this, t, e);
  }
  toggle(t = {}, e) {
    this.imageContainer = null;
    const i = new S(this, t, e);
    return this.wrapper.append(i), i;
  }
  list(t = {}, e) {
    return this.imageContainer = null, new X(this, t, e);
  }
  color(t = {}, e) {
    return this.imageContainer = null, new W(this, t, e);
  }
  vector2(t = {}, e) {
    return this.imageContainer = null, new G(this, t, e);
  }
  folder(t = {}) {
    let e = typeof t.closed == "boolean" ? t.closed : !1, i = t.label || "", s = t.color || null, l = t.maxHeight || null;
    this.imageContainer = null;
    let a = "p-gui__folder";
    this.folders.length == 0 && (a += " p-gui__folder--first"), e && (a += " p-gui__folder--closed");
    let o = s ? `background-color: ${s};` : "";
    o += l ? `max-height: ${l}px;` : "";
    const r = document.createElement("div");
    r.className = a, r.style = o, this.wrapper.append(r);
    const d = document.createElement("div");
    d.innerHTML = `<span class="p-gui__folder-arrow"></span>${i}`, d.className = "p-gui__folder-header", r.append(d);
    const c = document.createElement("div");
    c.className = "p-gui__folder-content", r.append(c);
    const n = document.createElement("div");
    n.className = "p-gui__folder-inner", c.append(n), d.addEventListener("click", () => {
      r.classList.toggle("p-gui__folder--closed");
    });
    let f = new C({
      isFolder: !0,
      folderOptions: {
        wrapper: r,
        inner: n,
        parent: this,
        firstParent: this.firstParent
      }
    });
    return this.folders.push(f), f;
  }
  _makeDraggable() {
    var t = this;
    this.header.addEventListener("pointerdown", e), this.header.addEventListener("pointerup", s);
    function e(l) {
      l.preventDefault(), t.position.initX = t.position.x, t.position.initY = t.position.y, t.position.prevX = l.clientX, t.position.prevY = l.clientY, document.addEventListener("pointermove", i);
    }
    function i(l) {
      l.preventDefault(), t.hasBeenDragged || (t.hasBeenDragged = !0, t.domElement.setAttribute("data-dragged", "true")), t.position.x = t.position.initX + l.clientX - t.position.prevX, t.position.y = t.position.initY + l.clientY - t.position.prevY, t.domElement.style.transform = "translate3d(" + t.position.x + "px," + t.position.y + "px,0)";
    }
    function s(l) {
      document.removeEventListener("pointermove", i);
    }
  }
  toggleClose() {
    this.closed = !this.closed, this.closed ? (this.previousInnerScroll = this.wrapper.scrollTop, this.wrapper.scrollTo(0, 0)) : this.wrapper.scrollTo(0, this.previousInnerScroll), this.domElement.classList.toggle("p-gui--collapsed");
  }
  kill() {
    this.domElement.remove();
  }
  _mapLinear(t, e, i, s, l) {
    return s + (t - e) * (l - s) / (i - e);
  }
  _countDecimals(t) {
    const e = t.toString(), i = e.indexOf(".");
    return i === -1 ? 0 : e.length - i - 1;
  }
  static registerPlugin(t) {
    for (let e in t)
      C.prototype[e] = t[e];
  }
}
export {
  C as default
};
