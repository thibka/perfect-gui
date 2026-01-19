let F = class {
  constructor(t, e = {}, i) {
    this.parent = t;
    let s = "";
    typeof e != "string" ? typeof e == "object" && (e != null && e.hasOwnProperty("label")) ? s = e.label == "" ? " " : e.label : s = " " : s = e == "" ? " " : e;
    const l = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null, a = document.createElement("div");
    return a.className = "p-gui__button", a.textContent = s, l && a.setAttribute("title", l), a.addEventListener("click", () => {
      i && i(), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), typeof e.color == "string" && (a.style.setProperty("--color-accent", e.color), a.style.setProperty("--color-accent-hover", e.hoverColor || e.color)), this.parent.wrapper.append(a), a;
  }
};
class M {
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
    const p = document.createElement("div");
    p.className = "p-gui__slider-name", p.textContent = s, r.append(p), this.ctrlDiv = document.createElement("div"), this.ctrlDiv.className = "p-gui__slider-ctrl", this.ctrlDiv.setAttribute("type", "range"), this.ctrlDiv.setAttribute("min", this.min), this.ctrlDiv.setAttribute("max", this.max), r.append(this.ctrlDiv);
    const u = document.createElement("div");
    return u.className = "p-gui__slider-bar", this.ctrlDiv.append(u), this.handle = document.createElement("div"), this.handle.className = "p-gui__slider-handle", this.ctrlDiv.append(this.handle), this.filling = document.createElement("div"), this.filling.className = "p-gui__slider-filling", u.append(this.filling), this.valueInput = document.createElement("input"), this.valueInput.className = "p-gui__slider-value", this.valueInput.value = this.isObject ? this.obj[this.prop] : a, r.append(this.valueInput), setTimeout(() => {
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
    const p = parseFloat((a + this.step).toFixed(9)), u = parseFloat((a - this.step).toFixed(9));
    (r >= p || r <= u) && (r = r.toFixed(this.decimals), this.valueInput.value = r, this.ctrlDiv.prevPosition = t.clientX, this.handle.style.transform = `translate(-50%, -50%) translateX(${o}px)`, this.handle.position = o, this.filling.style.width = this.handle.position + "px", this._triggerCallbacks());
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
    const o = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? a : null, r = e.selected === !0, p = e.selectionBorder !== !1;
    let u = "";
    e.width && (typeof e.width == "number" && (e.width += "px"), u += `flex: 0 0 calc(${e.width} - 5px); `), e.height && (typeof e.height == "number" && (e.height += "px"), u += `height: ${e.height}; `);
    const n = document.createElement("div");
    n.className = "p-gui__image", n.style = "background-image: url(" + s + "); " + u, o && n.setAttribute("title", o), this.parent.imageContainer.append(n), r && p && n.classList.add("p-gui__image--selected");
    const g = document.createElement("div");
    return g.className = "p-gui__image-text", g.textContent = a, n.append(g), n.addEventListener("click", () => {
      let d = n.parentElement.querySelectorAll(".p-gui__image--selected");
      for (let c = 0; c < d.length; c++)
        d[c].classList.remove("p-gui__image--selected");
      p && n.classList.add("p-gui__image--selected"), typeof i == "function" && i({ path: s, text: a }), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), n;
  }
}
class N {
  constructor(t, e = {}, i) {
    if (this.parent = t, typeof e != "object")
      throw Error(`[GUI] toggle() first parameter must be an object. Received: ${typeof e}.`);
    let s = typeof e.label == "string" && e.label || " ", l = !1, a = null, o = e.obj, r = e.prop, p = typeof e.value == "boolean" ? e.value : null;
    if (p !== null)
      (r != null || o != null) && console.warn('[GUI] toggle() "obj" and "prop" parameters are ignored when a "value" parameter is used.');
    else if (r != null && o != null) {
      if (typeof r != "string")
        throw Error(`[GUI] toggle() "prop" parameter must be an string. Received: ${typeof r}.`);
      if (typeof o != "object")
        throw Error(`[GUI] toggle() "obj" parameter must be an object. Received: ${typeof o}.`);
      s == " " && (s = r), a = this.parent.propReferences.push(o[r]) - 1, l = !0;
    } else
      (r != null && o == null || r == null && o == null) && console.warn('[GUI] toggle() "obj" and "prop" parameters must be used together.');
    const u = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null, n = document.createElement("div");
    n.textContent = s, n.className = "p-gui__toggle", u && n.setAttribute("title", u), n.addEventListener("click", (c) => {
      const h = c.target.childNodes[1];
      let f = !0;
      h.classList.contains("p-gui__toggle-checkbox--active") && (f = !1), h.classList.toggle("p-gui__toggle-checkbox--active"), l ? o[r] = f : typeof i == "function" && i(f), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    });
    let g = (() => l ? o[r] ? " p-gui__toggle-checkbox--active" : "" : p ? " p-gui__toggle-checkbox--active" : "")();
    const d = document.createElement("div");
    return d.className = "p-gui__toggle-checkbox" + g, n.append(d), l && Object.defineProperty(o, r, {
      set: (c) => {
        this.parent.propReferences[a] = c, c ? d.classList.add("p-gui__toggle-checkbox--active") : d.classList.remove("p-gui__toggle-checkbox--active"), typeof i == "function" && i(c);
      },
      get: () => this.parent.propReferences[a]
    }), n;
  }
}
class X {
  constructor(t, e = {}, i) {
    if (this.parent = t, typeof e != "object")
      throw Error(`[GUI] list() first parameter must be an object. Received: ${typeof e}.`);
    let s = typeof e.label == "string" ? e.label : " ", l = !1, a = null, o = e.obj, r = e.prop, p = Array.isArray(e.values) ? e.values : null, u, n = typeof p[0] != "string";
    const g = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null;
    if (i = typeof i == "function" ? i : null, e.value !== void 0 || e.value === void 0 && o === void 0 && r === void 0)
      (r != null || o != null) && console.warn('[GUI] list() "obj" and "prop" parameters are ignored when a "value" parameter is used.'), u = (() => {
        if (!p)
          return null;
        if (typeof e.value == "string")
          return p.indexOf(e.value);
        if (typeof e.value == "number")
          return e.value;
      })();
    else if (r != null && o != null) {
      if (typeof r != "string")
        throw Error(`[GUI] list() "prop" parameter must be an string. Received: ${typeof r}.`);
      if (typeof o != "object")
        throw Error(`[GUI] list() "obj" parameter must be an object. Received: ${typeof o}.`);
      u = (() => {
        if (!p)
          return null;
        if (typeof o[r] == "string")
          return n ? p.find((h) => h.value === o[r]).value : p.indexOf(o[r]);
        if (typeof o[r] == "number")
          return n ? p.find((h) => h.value === o[r]).value : o[r];
      })(), a = this.parent.propReferences.push(o[r]) - 1, l = !0;
    } else
      (r != null && o == null || r == null && o == null) && console.warn('[GUI] list() "obj" and "prop" parameters must be used together.');
    let d = document.createElement("div");
    d.className = "p-gui__list", d.textContent = s, g && d.setAttribute("title", g), this.parent.wrapper.append(d);
    let c = document.createElement("select");
    return d.append(c), c.className = "p-gui__list-dropdown", c.addEventListener("change", (h) => {
      l ? o[r] = h.target.value : i && i(h.target.value), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), p && p.forEach((h, f) => {
      const b = n ? h.label : h, v = n ? h.value : h;
      let m = document.createElement("option");
      m.setAttribute("value", v), m.textContent = b, c.append(m), (!n && u == f || n && u == v) && m.setAttribute("selected", "");
    }), l && Object.defineProperty(o, r, {
      set: (h) => {
        let f, b, v;
        n ? (v = p.find((w) => w.value == h), b = (v == null ? void 0 : v.value) || p[0].value, f = p.indexOf(v)) : (typeof h == "string" && (f = p.indexOf(h), b = h), typeof h == "number" && (f = h, b = p[h])), this.parent.propReferences[a] = n ? b : h;
        const m = c.querySelector("[selected]");
        m && m.removeAttribute("selected"), c.querySelectorAll("option")[f].setAttribute("selected", ""), typeof i == "function" && i(n ? v : b, f);
      },
      get: () => this.parent.propReferences[a]
    }), d;
  }
}
class S {
  constructor(t, e = {}, i) {
    if (this.parent = t, typeof e != "object")
      throw Error(`[GUI] color() first parameter must be an object. Received: ${typeof e}.`);
    let s = typeof e.label == "string" && e.label || " ", l = !1, a = null, o = e.obj, r = e.prop, p;
    const u = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null;
    if (typeof e.value == "string" && (e.value.length != 7 || e.value[0] != "#" ? console.error(`[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${e.value}".`) : p = e.value), p || (p = "#000000"), e.value !== void 0)
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
    n.className = "p-gui__color", n.textContent = s, u && n.setAttribute("title", u), this.parent.wrapper.append(n);
    const g = document.createElement("input");
    return g.className = "p-gui__color-picker", g.setAttribute("type", "color"), g.value = p, n.append(g), typeof i == "function" && g.addEventListener("input", () => {
      l ? o[r] = g.value : typeof i == "function" && i(g.value), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    }), l && Object.defineProperty(o, r, {
      set: (d) => {
        this.parent.propReferences[a] = d, g.value = d, typeof i == "function" && i(d);
      },
      get: () => this.parent.propReferences[a]
    }), n;
  }
}
class W {
  constructor(t, e = {}, i) {
    if (this.parent = t, typeof e != "object")
      throw Error(`[GUI] vector2() first parameter must be an object. Received: ${typeof e}.`);
    let s = typeof e.label == "string" && e.label || " ";
    const l = e.x.min ?? 0, a = e.x.max ?? 1, o = e.y.min ?? 0, r = e.y.max ?? 1, p = e.x.step || (a - l) / 100, u = e.y.step || (r - o) / 100, n = this.parent._countDecimals(p), g = this.parent._countDecimals(u), d = e.x.obj, c = e.x.prop, h = this.parent.propReferences.push(d[c]) - 1, f = e.y.obj, b = e.y.prop, v = this.parent.propReferences.push(f[b]) - 1, m = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null;
    i = typeof i == "function" ? i : null;
    const w = document.createElement("div");
    w.className = "p-gui__vector2", w.textContent = s, m && w.setAttribute("title", m), this.parent.wrapper.append(w);
    const k = document.createElement("div");
    k.className = "p-gui__vector-value", k.textContent = d[c] + ", " + f[b], w.append(k);
    const _ = document.createElement("div");
    _.className = "p-gui__vector2-area", w.append(_), _.addEventListener("click", (x) => {
      const E = parseFloat(this.parent._mapLinear(x.offsetX, 0, _.clientWidth, l, a)), j = parseFloat(this.parent._mapLinear(x.offsetY, 0, _.clientHeight, r, o));
      d[c] = E.toFixed(n), f[b] = j.toFixed(g), i && i(d[c], d[b]), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    });
    const U = (x) => {
      const E = _.getBoundingClientRect(), j = x.clientX - E.left, P = x.clientY - E.top, $ = this.parent._mapLinear(j, 0, _.clientWidth, l, a), O = this.parent._mapLinear(P, 0, _.clientHeight, r, o), D = Math.max(l, Math.min(a, $)), L = Math.max(o, Math.min(r, O));
      d[c] = parseFloat(D.toFixed(n)), f[b] = parseFloat(L.toFixed(g)), i && i(d[c], f[b]), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
    };
    _.addEventListener("pointerdown", (x) => {
      U(x), document.addEventListener("pointermove", U), document.addEventListener("pointerup", () => {
        document.removeEventListener("pointermove", U);
      }, { once: !0 });
    });
    const C = document.createElement("div");
    C.className = "p-gui__vector2-line p-gui__vector2-line-x", _.append(C);
    const R = document.createElement("div");
    R.className = "p-gui__vector2-line p-gui__vector2-line-y", _.append(R);
    const A = document.createElement("div");
    return A.className = "p-gui__vector2-dot", _.append(A), A.style.left = this.parent._mapLinear(d[c], l, a, 0, _.clientWidth) + "px", A.style.top = this.parent._mapLinear(f[b], o, r, _.clientHeight, 0) + "px", Object.defineProperty(d, c, {
      set: (x) => {
        this.parent.propReferences[h] = x, A.style.left = this.parent._mapLinear(x, l, a, 0, _.clientWidth) + "px", k.textContent = String(x) + ", " + f[b];
      },
      get: () => this.parent.propReferences[h]
    }), Object.defineProperty(f, b, {
      set: (x) => {
        this.parent.propReferences[v] = x, A.style.top = this.parent._mapLinear(x, o, r, _.clientHeight, 0) + "px", k.textContent = d[c] + ", " + String(x);
      },
      get: () => this.parent.propReferences[v]
    }), w;
  }
}
const G = (
  /* css */
  `
.p-gui__button {
    background: var(--color-accent);
    text-align: center;
    color: var(--color-bg);
    border: none;
    border: 1px solid transparent;
    box-sizing: border-box;
    transition: var(--transition) background, var(--transition) border-color;
}

.p-gui__button:hover {
    background: var(--color-accent-hover);
    border-color: rgba(255, 255, 255, 0.2);
}

.p-gui__folder .p-gui__button {
    margin-inline: 0;
}
`
), Y = (
  /* css */
  `
.p-gui__slider {
    position: relative;
    min-height: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--color-text-dark);
    transition: color var(--transition);
    padding: 3px;
}

.p-gui__slider:hover {
    color: var(--color-text-light);
}

.p-gui__slider-name {
    width: 50%;
    text-overflow: ellipsis;
    overflow: hidden;
}

.p-gui__slider-ctrl {
    -webkit-appearance: none;
    padding: 0;
    font: inherit;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    right: 0;
    height: 14px;
    margin: 0 0 0 auto;
    width: 37%;
}

.p-gui__slider-bar {
    position: absolute;
    top: 50%;
    left: 0;
    height: 2px;
    background: rgba(255, 255, 255, .2);
    width: 100%;
    transform: translateY(-50%);
}

.p-gui__slider-filling {
    position: absolute;
    top: -25%;
    left: 0;
    height: 100%;
    background: var(--color-accent);
    width: 0;
}

.p-gui__slider:hover .p-gui__slider-filling {
    background: var(--color-accent-hover);
}

.p-gui__slider-handle {
    width: 9px;
    height: 9px;
    position: absolute;
    top: 50%;
    left: 0;
    border-radius: 2px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    background: var(--color-text-dark);
    box-shadow: 0 0 2px rgba(0, 0, 0, .5);
}

.p-gui__slider:hover .p-gui__slider-handle {
    background: var(--color-text-light);
}

.p-gui__slider-value {
    display: inline-block;
    right: 7px;
    width: 13%;
    border: none;
    color: white;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 4px;
    color: inherit;
}

.p-gui__slider-value:focus {
    outline: none;
}
`
), B = (
  /* css */
  `
.p-gui__list {
    cursor: default;
    color: var(--color-text-dark);
    transition: var(--transition) color;
}

.p-gui__list:hover {
    color: var(--color-text-light);
}

.p-gui__list-dropdown {
    background: rgba(255, 255, 255,.05);
    color: white;
    padding: 0 12px 0 5px;
    top: 0px;
}

.p-gui__list-dropdown {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: calc(100% - 4px);
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid var(--color-border-2);
    outline: none;

    option {
        background: white;
        color: black;
    }
}

.p-gui__list-dropdown:hover {
    background: rgba(255, 255, 255, .1);
}
`
), z = (
  /* css */
  `
.p-gui__toggle {
    color: var(--color-text-dark);
    transition: var(--transition) background, var(--transition) color;
}

.p-gui__toggle:hover {
    background: rgba(255, 255, 255, .1);
    color: var(--color-text-light);
}

.p-gui__folder .p-gui__toggle {
    margin-inline: 0;
}

.p-gui__toggle-checkbox {
    width: 10px;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    margin: auto;
    border-radius: 2px;
    pointer-events: none;
    transition: .5s all ease;
}

.p-gui__toggle-checkbox--active {
    background-color: #ddd;
    box-shadow: 0 0 5px #ddd;
}
`
), V = (
  /* css */
  `
.p-gui__color {
    cursor: default;
    color: var(--color-text-dark);
    transition: var(--transition) color;
}

.p-gui__color:hover {
    color: var(--color-text-light);
}

.p-gui__color-picker {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: calc(100% - 4px);
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid var(--color-border-2);
    outline: none;
    -webkit-appearance: none;
    padding: 0;
    background-color: transparent;
    border: 1px solid #222222;
    overflow: hidden;
}

.p-gui__color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
}
.p-gui__color-picker::-webkit-color-swatch {
    border: none;
}
`
), T = (
  /* css */
  `
    .p-gui__vector2 {
        background: transparent;
        aspect-ratio: 1;
        padding-bottom: 0;
        color: var(--color-text-dark);
    }
    
    .p-gui__vector2:hover {
        color: var(--color-text-light);
    }
    
    .p-gui__vector2-area {
        position: relative;
        background: rgba(0, 0, 0, .3);
        margin-top: 8px;
        width: 100%;
        height: calc(100% - 28px);
        touch-action: none;
    }
    
    .p-gui__vector2-line {
        position: absolute;
        background: white;
        opacity: .3;
        pointer-events: none;
    }
    
    .p-gui__vector2-line-x {
        width: 100%;
        height: 1px;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
    
    .p-gui__vector2-line-y {
        width: 1px;
        height: 100%;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
    }
    
    .p-gui__vector2-dot {
        position: absolute;
        top: 0;
        left: 0;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #d5d5d5;
        border: 2px solid #ff9999;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
    
    .p-gui__vector-value {
        display: inline-block;
        right: 7px;
        position: absolute;
    }
`
), Q = (
  /* css */
  `
    .p-gui__image-container {
        width: 100%;
        padding: 3px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        box-sizing: border-box;
    }
    
    .p-gui__image {
        background-size: cover;
        cursor: pointer;
        position: relative;
        margin: 1px 2.5px 19px 2.5px;
        border-radius: var(--main-border-radius);
        flex: 0 0 calc(33.333% - 5px);
        height: 90px;
        background-position: center;
        color: var(--color-text-dark);
        transition: var(--transition) color;
    }

    .p-gui__image:hover {
        color: var(--color-text-light);
    }

    .p-gui__image::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        border: 1px solid transparent;
        box-sizing: border-box;
        border-radius: var(--main-border-radius);
        transition: var(--transition) border-color;
    }
    .p-gui__image--selected::after {
        border-color: #06FF89;
    }
    
    .p-gui__image-text {
        position: absolute;
        bottom: -15px;
        text-shadow: 0 -1px 0 #111;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        
    }
`
), q = (
  /* css */
  `
    .p-gui__folder {
        width: 100%;
        position: relative;
        background: var(--color-bg);
        overflow: auto;
        margin-bottom: 2px;
        display: flex;
        flex-wrap: wrap;
        border: 1px solid var(--color-border-2);
        padding: 0 2px 0 3px;
        border-radius: var(--main-border-radius);
        box-sizing: border-box;
        border-left: 1px solid #bbbbbb;
    }
    
    .p-gui__folder--first {
        margin-top: 0;
    }
    
    .p-gui__folder--closed {
        height: 25px;
        overflow: hidden;
    }
    
    .p-gui__folder-header {
        padding: 5px 3px;
        background-color: rgba(0, 0, 0, .5);
        color: white;
        cursor: pointer;
        width: 100%;
        margin: 0 -2px 2px -3px;
    }
    
    .p-gui__folder-header:hover {
        background-color: rgba(0, 0, 0, .75);
    }
    
    .p-gui__folder-arrow {
        width: 8px;
        height: 8px;
        display: inline-block;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAHlBMVEUAAAD///////////////////////////////////8kfJuVAAAACXRSTlMA9Z1fCdMo1yxEJnA0AAAAK0lEQVQI12PABlRgjKkJUMZMYRhjpgqMAZSEMICSaIzpDWiKhdENhEhgAgATSg5jyWnYewAAAABJRU5ErkJggg==);
        background-size: contain;
        margin-right: 5px;
        transform: rotate(90deg)
    }
    
    .p-gui__folder--closed .p-gui__folder-arrow {
        transform: rotate(0deg);
    }
`
);
function J(y) {
  return (
    /* css */
    `
    .p-gui {
        --main-border-radius: 3px;
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
        padding-top: 21px;
        padding-inline: 3px;
        background: var(--color-bg);
        display: block;
        justify-content: center;
        flex-wrap: wrap;
        font-family: "Arial Rounded MT Bold", Arial, sans-serif;
        width: 290px;
        overflow: auto;
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
    
    .p-gui--collapsed {
        height: 0;
        padding: 21px 10px 0 10px;
        overflow: hidden;
    }
    
    .p-gui__header {
        position: absolute;
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
    
    ${G}
    
    ${Q}
    
    ${B}
    
    ${z}

    ${Y}
    
    ${V}
    
    ${T}
    
    ${q}
`
  );
}
class I {
  constructor(t = {}) {
    if (this.firstParent = this, t.container ? (this.container = typeof t.container == "string" ? document.querySelector(t.container) : t.container, this.position_type = "absolute") : (this.container = document.body, this.position_type = "fixed"), this.propReferences = [], this.folders = [], t.isFolder) {
      this._folderConstructor(t.folderOptions);
      return;
    }
    typeof t.onUpdate == "function" && (this.onUpdate = t.onUpdate), this.label = t != null && typeof t.label == "string" ? t.label : "", this.backgroundColor = t.color || null, this.opacity = t.opacity || 1, this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight), t.maxHeight && (this.initMaxHeight = t.maxHeight, this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.screenCorner = this._parseScreenCorner(t.position), window.perfectGUI || (window.perfectGUI = {}), window.perfectGUI.instanceCounter == null ? window.perfectGUI.instanceCounter = 0 : window.perfectGUI.instanceCounter++, this.instanceId = window.perfectGUI.instanceCounter, this.wrapperWidth = t.width || 290, this.stylesheet = document.createElement("style"), this.stylesheet.setAttribute("type", "text/css"), this.stylesheet.setAttribute("id", "lm-gui-stylesheet"), document.head.append(this.stylesheet), this.instanceId == 0 && this._addStyles(`${J(this.position_type)}`), this._styleInstance(), this._addWrapper(), this.wrapper.setAttribute("data-corner-x", this.screenCorner.x), this.wrapper.setAttribute("data-corner-y", this.screenCorner.y), t.autoRepositioning != !1 && window.addEventListener("resize", this._handleResize.bind(this)), this._handleResize(), this.hasBeenDragged = !1, t.draggable == !0 && this._makeDraggable(), this.closed = !1, t.closed && this.toggleClose();
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
    this.wrapper = t.wrapper, this.isFolder = !0, this.parent = t.parent, this.firstParent = t.firstParent;
  }
  _parseScreenCorner(t) {
    let e = { x: "right", y: "top" };
    return t == null || (typeof t != "string" && console.error("[perfect-gui] Position must be a string."), t.includes("left") && (e.x = "left"), t.includes("bottom") && (e.y = "bottom")), e;
  }
  _getScrollbarWidth(t) {
    return t === document.body ? window.innerWidth - document.documentElement.clientWidth : t.offsetWidth - t.clientWidth;
  }
  _handleResize() {
    if (this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight), this.initMaxHeight && (this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.wrapper.style.maxHeight = this.maxHeight + "px", this.hasBeenDragged)
      return;
    let t = this._getScrollbarWidth(this.container);
    if (this.xOffset = this.screenCorner.x == "left" ? 0 : this.container.clientWidth - this.wrapperWidth - t, this.instanceId > 0) {
      let e = this.container.querySelectorAll(`.p-gui:not(#${this.wrapper.id}):not([data-dragged])`);
      for (let i = 0; i < e.length && !(parseInt(e[i].id.replace("p-gui-", "")) > this.instanceId); i++)
        this.screenCorner.y == e[i].dataset.cornerY && (this.screenCorner.x == "left" && e[i].dataset.cornerX == "left" ? this.xOffset += e[i].offsetWidth : this.screenCorner.x == "right" && e[i].dataset.cornerX == "right" && (this.xOffset -= e[i].offsetWidth));
    }
    this.position = { prevX: this.xOffset, prevY: this.yOffset, x: this.xOffset, y: this.yOffset }, this.wrapper.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
  }
  _addStyles(t) {
    this.stylesheet.innerHTML += t;
  }
  _addWrapper() {
    this.wrapper = document.createElement("div"), this.wrapper.id = "p-gui-" + this.instanceId, this.wrapper.className = "p-gui", this.wrapper.setAttribute("data-lenis-prevent", ""), this.container.append(this.wrapper), this.header = document.createElement("div"), this.header.className = "p-gui__header", this.header.textContent = this.label, this.header.style = `${this.backgroundColor ? "border-color: " + this.backgroundColor + ";" : ""}`, this.wrapper.append(this.header);
    const t = document.createElement("div");
    t.className = "p-gui__header-close", t.addEventListener("click", this.toggleClose.bind(this)), this.header.append(t);
  }
  button(t = {}, e) {
    return this.imageContainer = null, new F(this, t, e);
  }
  image(t = {}, e) {
    return this.imageContainer || (this.imageContainer = document.createElement("div"), this.imageContainer.className = "p-gui__image-container", this.wrapper.append(this.imageContainer)), new H(this, t, e);
  }
  slider(t = {}, e) {
    return this.imageContainer = null, new M(this, t, e);
  }
  toggle(t = {}, e) {
    this.imageContainer = null;
    const i = new N(this, t, e);
    return this.wrapper.append(i), i;
  }
  list(t = {}, e) {
    return this.imageContainer = null, new X(this, t, e);
  }
  color(t = {}, e) {
    return this.imageContainer = null, new S(this, t, e);
  }
  vector2(t = {}, e) {
    return this.imageContainer = null, new W(this, t, e);
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
    const p = document.createElement("div");
    p.innerHTML = `<span class="p-gui__folder-arrow"></span>${i}`, p.className = "p-gui__folder-header", r.append(p), p.addEventListener("click", () => {
      r.classList.toggle("p-gui__folder--closed");
    });
    let u = new I({ isFolder: !0, folderOptions: {
      wrapper: r,
      parent: this,
      firstParent: this.firstParent
    } });
    return this.folders.push(u), u;
  }
  _makeDraggable() {
    var t = this;
    this.header.addEventListener("pointerdown", e), this.header.addEventListener("pointerup", s);
    function e(l) {
      l.preventDefault(), t.position.initX = t.position.x, t.position.initY = t.position.y, t.position.prevX = l.clientX, t.position.prevY = l.clientY, document.addEventListener("pointermove", i);
    }
    function i(l) {
      l.preventDefault(), t.hasBeenDragged || (t.hasBeenDragged = !0, t.wrapper.setAttribute("data-dragged", "true")), t.position.x = t.position.initX + l.clientX - t.position.prevX, t.position.y = t.position.initY + l.clientY - t.position.prevY, t.wrapper.style.transform = "translate3d(" + t.position.x + "px," + t.position.y + "px,0)";
    }
    function s(l) {
      document.removeEventListener("pointermove", i);
    }
  }
  toggleClose() {
    this.closed = !this.closed, this.closed ? (this.previousInnerScroll = this.wrapper.scrollTop, this.wrapper.scrollTo(0, 0)) : this.wrapper.scrollTo(0, this.previousInnerScroll), this.wrapper.classList.toggle("p-gui--collapsed");
  }
  kill() {
    this.wrapper.remove();
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
      I.prototype[e] = t[e];
  }
}
export {
  I as default
};
