function y(w) {
  return (
    /* css */
    `
    .p-gui {
        --main-border-radius: 5px;
        --color-bg: #121212;
        --color-border: #484848;
        --color-border-2: rgba(255,255,255,.1);
        --color-accent: #1681ca;
        --color-accent-hover: #218fda;
    
        position: ${w};
        top: 0;
        left: 0;
        transform: translate3d(0,0,0);
        padding-top: 21px;
        background: var(--color-bg);
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        font-family: Verdana, Arial, sans-serif;
        width: 290px;
        overflow: auto;
        box-shadow: 0 0 2px black;
        box-sizing: border-box;
        z-index: 99999;
        user-select: none;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        cursor: auto;
        border-radius: var(--main-border-radius);
        border: 1px solid var(--color-border);
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
    
    .p-gui__image-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 32%);
        justify-content: space-between;
        padding: 0 2%;
    }
    
    .p-gui__image {
        aspect-ratio: 1 / 1;
        background-size: cover;
        cursor: pointer;
        position: relative;
        margin-top: 1px;
        margin-bottom: 19px;
    }
    
    .p-gui__image-text {
        position: absolute;
        bottom: -15px;
        color: #eee;
        text-shadow: 0 -1px 0 #111;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .p-gui__button, 
    .p-gui__switch,
    .p-gui__list,
    .p-gui__vector2,
    .p-gui__color {
        width: 100%;
        padding: 7px 13px;
        color: white;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
        margin-bottom: 3px;
        margin: 3px;
        
        border: 1px solid var(--color-border-2);
        border-radius: var(--main-border-radius);
    }

    .p-gui__vector2 {
        padding: 7px;
    }
    
    .p-gui__button,
    .p-gui__switch {
        margin-right: 4px;
        margin-left: 4px;
    }
    
    .p-gui__button {
        background: var(--color-accent);
        text-align: center;
        color: white;
        border: none;
    }
    
    .p-gui__button:hover {
        background: var(--color-accent-hover);
    }
    
    .p-gui__switch {
        background: rgba(255, 255, 255, .05);
    }

    .p-gui__switch:hover {
        background: rgba(255, 255, 255, .1);
    }
    
    .p-gui__folder .p-gui__button,
    .p-gui__folder .p-gui__switch {
        margin-right: 0;
        margin-left: 0;
    }
    
    .p-gui__vector2 {
        background: transparent;
        aspect-ratio: 1;
        padding-bottom: 0;
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
    
    .p-gui__switch-checkbox {
        width: 5px;
        height: 5px;
        background-color: rgba(0, 0, 0, .5);
        border: 1px solid grey;
        position: absolute;
        top: 0;
        right: 10px;
        bottom: 0;
        margin: auto;
        border-radius: 50%;
        pointer-events: none;
    }
    
    .p-gui__switch-checkbox--active {
        background-color: #00ff89;
        box-shadow: 0 0 7px #00ff89;
    }
    
    .p-gui__list,
    .p-gui__color {
        cursor: default;
    }
    
    .p-gui__list-dropdown,
    .p-gui__color-picker {
        position: absolute;
        right: 5px;
        top: 0;
        bottom: 0;
        margin: auto;
        height: 21px;
        cursor: pointer;
        border-radius: 3px;
        border: 1px solid var(--color-border-2);
    }
    
    .p-gui__list-dropdown {
        background: rgba(255, 255, 255,.05);
        color: white;
        padding: 0 12px;
        top: 0px;
    }
    
    .p-gui__list-dropdown:hover {
        background: rgba(255, 255, 255, .1);
    }
    
    .p-gui__color-picker {
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
    
    .p-gui__slider {
        width: 100%;
        margin-bottom: 8px;
        padding: 7px;
        color: white;
        position: relative;
        min-height: 14px;
    }
    
    .p-gui__slider-ctrl {
        -webkit-appearance: none;
        padding: 0;
        font: inherit;
        outline: none;
        opacity: .8;
        background: var(--color-accent);
        box-sizing: border-box;
        cursor: pointer;
        position: absolute;
        bottom: -4px; /* 5px height -1px de dépassement du curseur */
        right: 0;
        height: 5px;
        width: 100%;
        margin: 0;
    }
    
    /* la zone de déplacement */
    .p-gui__slider-ctrl::-webkit-slider-runnable-track {
        height: 13px;
        border: none;
        border-radius: 0;
        background-color: transparent;  /* supprimé définie sur l'input */
    }
    
    /* Curseur */
    .p-gui__slider-ctrl::-webkit-slider-thumb {
        -webkit-appearance: none;       /* également nécessaire sur le curseur */
        width: 15px;
        height: 7px;
        border: none;             /* pris en compte sur Webkit et Edge */
        background: white;       /* pris en compte sur Webkit only */
        position: relative;
        top: 3px;
        border-radius: 1px;
    }
    
    .p-gui__slider-value,
    .p-gui__vector-value {
        display: inline-block;
        position: absolute;
        right: 7px;
    }
    
    .p-gui__folder {
        width: 100%;
        position: relative;
        background: #434343;
        overflow: auto;
        margin-bottom: 3px;
        display: flex;
        flex-wrap: wrap;
        border-left: 3px solid grey;
        border-bottom: 1px solid grey;
        padding: 0 3px;
    }
    
    .p-gui__folder:last-of-type {
        margin-bottom: 0;
        border-bottom: none;
    }
    
    .p-gui__folder--first {
        margin-top: 0;
    }
    
    .p-gui__folder--closed {
        height: 32px;
        overflow: hidden;
    }
    
    .p-gui__folder-header {
        padding: 10px 5px;
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
}
class h {
  constructor(e = {}) {
    if (e.container ? (this.container = typeof e.container == "string" ? document.querySelector(e.container) : e.container, this.position_type = "absolute") : (this.container = document.body, this.position_type = "fixed"), this.propReferences = [], this.folders = [], e.isFolder) {
      this._folderConstructor(e.folderOptions);
      return;
    }
    this.name = e != null && typeof e.name == "string" ? e.name : "", this.backgroundColor = e.color || null, this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight), e.maxHeight && (this.initMaxHeight = e.maxHeight, this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.screenCorner = this._parseScreenCorner(e.position), this instanceof h && (typeof h[h.instanceCounter] != "number" ? h[h.instanceCounter] = 0 : h[h.instanceCounter]++), this.instanceId = h[h.instanceCounter], this.wrapperWidth = e.width || 290, this.stylesheet = document.createElement("style"), this.stylesheet.setAttribute("type", "text/css"), this.stylesheet.setAttribute("id", "lm-gui-stylesheet"), document.head.append(this.stylesheet), this.instanceId == 0 && this._addStyles(`${y(this.position_type)}`), this._styleInstance(), this._addWrapper(), this.wrapper.setAttribute("data-corner-x", this.screenCorner.x), this.wrapper.setAttribute("data-corner-y", this.screenCorner.y), e.autoRepositioning != !1 && window.addEventListener("resize", this._handleResize.bind(this)), this._handleResize(), this.hasBeenDragged = !1, e.draggable == !0 && this._makeDraggable(), this.closed = !1, e.closed && this.toggleClose();
  }
  _styleInstance() {
    let e = this._getScrollbarWidth(this.container);
    if (this.screenCorner.x == "left" ? this.xOffset = 0 : this.xOffset = this.container.clientWidth - this.wrapperWidth - e, this.instanceId > 0) {
      let t = this.container.querySelectorAll(".p-gui");
      for (let i = 0; i < t.length; i++)
        this.screenCorner.y == t[i].dataset.cornerY && (this.screenCorner.x == "left" && t[i].dataset.cornerX == "left" ? this.xOffset += t[i].offsetWidth : this.screenCorner.x == "right" && t[i].dataset.cornerX == "right" && (this.xOffset -= t[i].offsetWidth));
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
        }`);
  }
  _folderConstructor(e) {
    this.wrapper = e.wrapper;
  }
  _parseScreenCorner(e) {
    let t = { x: "right", y: "top" };
    return e == null || (typeof e != "string" && console.error("[perfect-gui] Position must be a string."), e.includes("left") && (t.x = "left"), e.includes("bottom") && (t.y = "bottom")), t;
  }
  _getScrollbarWidth(e) {
    return e === document.body ? window.innerWidth - document.documentElement.clientWidth : e.offsetWidth - e.clientWidth;
  }
  _handleResize() {
    if (this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight), this.initMaxHeight && (this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.wrapper.style.maxHeight = this.maxHeight + "px", this.hasBeenDragged)
      return;
    let e = this._getScrollbarWidth(this.container);
    if (this.xOffset = this.screenCorner.x == "left" ? 0 : this.container.clientWidth - this.wrapperWidth - e, this.instanceId > 0) {
      let t = this.container.querySelectorAll(`.p-gui:not(#${this.wrapper.id}):not([data-dragged])`);
      for (let i = 0; i < t.length && !(parseInt(t[i].id.replace("p-gui-", "")) > this.instanceId); i++)
        this.screenCorner.y == t[i].dataset.cornerY && (this.screenCorner.x == "left" && t[i].dataset.cornerX == "left" ? this.xOffset += t[i].offsetWidth : this.screenCorner.x == "right" && t[i].dataset.cornerX == "right" && (this.xOffset -= t[i].offsetWidth));
    }
    this.position = { prevX: this.xOffset, prevY: this.yOffset, x: this.xOffset, y: this.yOffset }, this.wrapper.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
  }
  _createElement(e) {
    e.el = e.el || "div";
    var t = document.createElement(e.el);
    if (e.id && (t.id = e.id), e.class && (t.className = e.class), e.inline && (t.style = e.inline), e.href && (t.href = e.href), e.onclick && (t.onclick = e.onclick), e.onchange && (t.onchange = e.onchange), e.textContent && (t.textContent = e.textContent), e.innerHTML && (t.innerHTML = e.innerHTML), e.type && (t.type = e.type), e.value && (t.value = e.value), e.customAttributes)
      for (var i in e.customAttributes)
        t.setAttribute(i, e.customAttributes[i]);
    return e.parent = e.parent ? e.parent : this.wrapper, e.parent.append(t), t;
  }
  _addStyles(e) {
    this.stylesheet.innerHTML += e;
  }
  _addWrapper() {
    this.wrapper = this._createElement({
      parent: this.container,
      id: "p-gui-" + this.instanceId,
      class: "p-gui"
    }), this.header = this._createElement({
      parent: this.wrapper,
      class: "p-gui__header",
      textContent: this.name,
      inline: `${this.backgroundColor ? "border-color: " + this.backgroundColor + ";" : ""}`
    }), this._createElement({
      parent: this.header,
      class: "p-gui__header-close",
      onclick: this.toggleClose.bind(this)
    });
  }
  button(e, t) {
    typeof e != "string" && (typeof e == "object" && (e != null && e.hasOwnProperty("name")) ? e = e.name : e = " "), e === "" && (e = " "), this.imageContainer = null, typeof t != "function" && (t = () => {
    }), this._createElement({
      class: "p-gui__button",
      textContent: e,
      onclick: t
    });
  }
  image(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] image() first parameter must be an object. Received: ${typeof e}.`);
    let i;
    if (typeof e.path == "string")
      i = e.path;
    else
      throw typeof e.path == null ? Error("[GUI] image() path must be provided.") : Error("[GUI] image() path must be a string.");
    let o = i.replace(/^.*[\\\/]/, ""), r;
    e.name == null ? r = o : r = typeof e.name == "string" && e.name || " ", this.imageContainer || (this.imageContainer = this._createElement({
      class: "p-gui__image-container"
    }));
    var n = this._createElement({
      class: "p-gui__image",
      inline: `background-image: url(${i})`,
      parent: this.imageContainer
    });
    this._createElement({
      parent: n,
      class: "p-gui__image-text",
      textContent: r
    }), typeof t == "function" && (n.onclick = () => t({ path: i, text: r }));
  }
  slider(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] slider() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ", o = !1, r = null, n = e.obj || e.object, s = e.prop || e.property, a = typeof e.value == "number" ? e.value : null, p = e.min ?? 0, f = e.max ?? 1, g = e.step || (f - p) / 100;
    if (a !== null)
      (s != null || n != null) && console.warn('[GUI] slider() "obj" and "property" parameters are ignored when a "value" parameter is used.');
    else if (s != null && n != null) {
      if (typeof s != "string")
        throw Error(`[GUI] slider() "prop" (or "property") parameter must be an string. Received: ${typeof s}.`);
      if (typeof n != "object")
        throw Error(`[GUI] slider() "obj" (or "object") parameter must be an object. Received: ${typeof n}.`);
      i == " " && (i = s), r = this.propReferences.push(n[s]) - 1, o = !0;
    } else
      (s != null && n == null || s == null && n == null) && console.warn('[GUI] slider() "obj" and "prop" parameters must be used together.'), a = (f - p) / 2;
    this.imageContainer = null;
    var d = this._createElement({
      class: "p-gui__slider",
      textContent: i
    }), u = this._createElement({
      parent: d,
      el: "input",
      class: "p-gui__slider-ctrl",
      customAttributes: {
        type: "range",
        min: p,
        max: f,
        step: g,
        value: o ? n[s] : a
      }
    }), _ = this._createElement({
      parent: d,
      class: "p-gui__slider-value",
      textContent: String(o ? n[s] : a)
    });
    u.addEventListener("input", () => {
      _.textContent = u.value, o && (n[s] = u.value), typeof t == "function" && t(parseFloat(u.value));
    }), o && Object.defineProperty(n, s, {
      set: (b) => {
        this.propReferences[r] = b, u.value = b, _.textContent = String(b);
      },
      get: () => this.propReferences[r]
    });
  }
  toggle(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] toggle() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ", o = e.value === !0;
    this.imageContainer = null;
    let r = this._createElement({
      class: "p-gui__switch",
      onclick: (s) => {
        let a = s.target.childNodes[1], p = !0;
        a.classList.contains("p-gui__switch-checkbox--active") && (p = !1), a.classList.toggle("p-gui__switch-checkbox--active"), typeof t == "function" && t(p);
      },
      textContent: i
    }), n = o ? " p-gui__switch-checkbox--active" : "";
    this._createElement({
      parent: r,
      class: "p-gui__switch-checkbox" + n
    });
  }
  list(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] list() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" ? e.name : " ", o = Array.isArray(e.values) ? e.values : null;
    t = typeof t == "function" ? t : null, this.imageContainer = null;
    let r = this._createElement({
      class: "p-gui__list",
      textContent: i
    }), n = this._createElement({
      parent: r,
      el: "select",
      class: "p-gui__list-dropdown",
      onchange: (s) => {
        t && t(s.target.value);
      }
    });
    o.forEach((s) => {
      this._createElement({
        parent: n,
        el: "option",
        customAttributes: {
          value: s
        },
        textContent: s
      });
    });
  }
  options(e, t) {
    if (typeof e != "object")
      throw Error(`[GUI] options() first parameter must be an object. Received: ${typeof e}.`);
    this.list(e, t);
  }
  vector2(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] vector2() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ";
    const o = e.x.min ?? 0, r = e.x.max ?? 1, n = e.y.min ?? 0, s = e.y.max ?? 1, a = e.x.obj || e.x.object, p = e.x.prop || e.x.property, f = this.propReferences.push(a[p]) - 1, g = e.y.obj || e.y.object, d = e.y.prop || e.y.property, u = this.propReferences.push(g[d]) - 1;
    t = typeof t == "function" ? t : null, this.imageContainer = null;
    const _ = this._createElement({
      class: "p-gui__vector2",
      textContent: i
    }), b = this._createElement({
      parent: _,
      class: "p-gui__vector-value",
      textContent: a[p] + ", " + g[d]
    }), l = this._createElement({
      parent: _,
      el: "div",
      class: "p-gui__vector2-area",
      onclick: (c) => {
        a[p] = parseFloat(this._mapLinear(c.offsetX, 0, l.clientWidth, o, r).toFixed(2)), g[d] = parseFloat(this._mapLinear(c.offsetY, 0, l.clientHeight, s, n).toFixed(2)), t && t(a[p], a[d]);
      }
    });
    let m = !1;
    l.addEventListener("pointerdown", (c) => {
      m = !0;
    }), l.addEventListener("pointerup", () => {
      m = !1;
    }), l.addEventListener("pointermove", (c) => {
      m && (a[p] = parseFloat(this._mapLinear(c.offsetX, 0, l.clientWidth, o, r).toFixed(2)), g[d] = parseFloat(this._mapLinear(c.offsetY, 0, l.clientHeight, s, n).toFixed(2)), t && t(a[p], a[d]));
    }), this._createElement({
      parent: l,
      class: "p-gui__vector2-line p-gui__vector2-line-x"
    }), this._createElement({
      parent: l,
      class: "p-gui__vector2-line p-gui__vector2-line-y"
    });
    const x = this._createElement({
      parent: l,
      class: "p-gui__vector2-dot"
    });
    x.style.left = this._mapLinear(a[p], o, r, 0, l.clientWidth) + "px", x.style.top = this._mapLinear(g[d], n, s, l.clientHeight, 0) + "px", Object.defineProperty(a, p, {
      set: (c) => {
        this.propReferences[f] = c, x.style.left = this._mapLinear(c, o, r, 0, l.clientWidth) + "px", b.textContent = String(c) + ", " + g[d];
      },
      get: () => this.propReferences[f]
    }), Object.defineProperty(g, d, {
      set: (c) => {
        this.propReferences[u] = c, x.style.top = this._mapLinear(c, n, s, l.clientHeight, 0) + "px", b.textContent = a[p] + ", " + String(c);
      },
      get: () => this.propReferences[u]
    });
  }
  color(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] color() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ", o;
    typeof e.value == "string" && (e.value.length != 7 || e.value[0] != "#" ? console.error(`[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${e.value}".`) : o = e.value), o || (o = "#000000");
    const r = this._createElement({
      el: "div",
      class: "p-gui__color",
      textContent: i
    }), n = this._createElement({
      parent: r,
      el: "input",
      class: "p-gui__color-picker",
      type: "color",
      value: o
    });
    typeof t == "function" && n.addEventListener("input", () => {
      t(n.value);
    });
  }
  folder(e = {}) {
    let t = typeof e.closed == "boolean" ? e.closed : !1, i = e.name || "", o = e.color || null, r = e.maxHeight || null;
    this.imageContainer = null;
    let n = "p-gui__folder";
    this.folders.length == 0 && (n += " p-gui__folder--first"), t && (n += " p-gui__folder--closed");
    let s = o ? `background-color: ${o};` : "";
    s += r ? `max-height: ${r}px;` : "";
    let a = this._createElement({
      class: n,
      inline: s
    });
    this._createElement({
      innerHTML: `<span class="p-gui__folder-arrow"></span>${i}`,
      class: "p-gui__folder-header",
      onclick: function() {
        this.parentNode.classList.toggle("p-gui__folder--closed");
      },
      parent: a
    });
    let p = new h({ isFolder: !0, folderOptions: {
      wrapper: a
    } });
    return this.folders.push(p), p;
  }
  _makeDraggable() {
    var e = this;
    this.header.addEventListener("pointerdown", t), this.header.addEventListener("pointerup", o);
    function t(r) {
      r.preventDefault(), e.position.initX = e.position.x, e.position.initY = e.position.y, e.position.prevX = r.clientX, e.position.prevY = r.clientY, document.addEventListener("pointermove", i);
    }
    function i(r) {
      r.preventDefault(), e.hasBeenDragged || (e.hasBeenDragged = !0, e.wrapper.setAttribute("data-dragged", "true")), e.position.x = e.position.initX + r.clientX - e.position.prevX, e.position.y = e.position.initY + r.clientY - e.position.prevY, e.wrapper.style.transform = "translate3d(" + e.position.x + "px," + e.position.y + "px,0)";
    }
    function o(r) {
      document.removeEventListener("pointermove", i);
    }
  }
  toggleClose() {
    this.closed = !this.closed, this.wrapper.classList.toggle("p-gui--collapsed");
  }
  kill() {
    this.wrapper.remove();
  }
  _mapLinear(e, t, i, o, r) {
    return o + (e - t) * (r - o) / (i - t);
  }
}
export {
  h as default
};
