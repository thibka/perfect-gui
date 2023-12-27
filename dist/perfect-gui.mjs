function w(m) {
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
    
        position: ${m};
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
        padding: 0 2%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
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
    }

    .p-gui__image--selected::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        border: 1px solid #06FF89;
        box-sizing: border-box;
        border-radius: var(--main-border-radius);
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
class _ {
  constructor(e = {}) {
    if (e.container ? (this.container = typeof e.container == "string" ? document.querySelector(e.container) : e.container, this.position_type = "absolute") : (this.container = document.body, this.position_type = "fixed"), this.propReferences = [], this.folders = [], e.isFolder) {
      this._folderConstructor(e.folderOptions);
      return;
    }
    this.name = e != null && typeof e.name == "string" ? e.name : "", this.backgroundColor = e.color || null, this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight), e.maxHeight && (this.initMaxHeight = e.maxHeight, this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.screenCorner = this._parseScreenCorner(e.position), this instanceof _ && (typeof _[_.instanceCounter] != "number" ? _[_.instanceCounter] = 0 : _[_.instanceCounter]++), this.instanceId = _[_.instanceCounter], this.wrapperWidth = e.width || 290, this.stylesheet = document.createElement("style"), this.stylesheet.setAttribute("type", "text/css"), this.stylesheet.setAttribute("id", "lm-gui-stylesheet"), document.head.append(this.stylesheet), this.instanceId == 0 && this._addStyles(`${w(this.position_type)}`), this._styleInstance(), this._addWrapper(), this.wrapper.setAttribute("data-corner-x", this.screenCorner.x), this.wrapper.setAttribute("data-corner-y", this.screenCorner.y), e.autoRepositioning != !1 && window.addEventListener("resize", this._handleResize.bind(this)), this._handleResize(), this.hasBeenDragged = !1, e.draggable == !0 && this._makeDraggable(), this.closed = !1, e.closed && this.toggleClose();
  }
  _styleInstance() {
    let e = this._getScrollbarWidth(this.container);
    if (this.screenCorner.x == "left" ? this.xOffset = 0 : this.xOffset = this.container.clientWidth - this.wrapperWidth - e, this.instanceId > 0) {
      let t = this.container.querySelectorAll(".p-gui");
      for (let o = 0; o < t.length; o++)
        this.screenCorner.y == t[o].dataset.cornerY && (this.screenCorner.x == "left" && t[o].dataset.cornerX == "left" ? this.xOffset += t[o].offsetWidth : this.screenCorner.x == "right" && t[o].dataset.cornerX == "right" && (this.xOffset -= t[o].offsetWidth));
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
      for (let o = 0; o < t.length && !(parseInt(t[o].id.replace("p-gui-", "")) > this.instanceId); o++)
        this.screenCorner.y == t[o].dataset.cornerY && (this.screenCorner.x == "left" && t[o].dataset.cornerX == "left" ? this.xOffset += t[o].offsetWidth : this.screenCorner.x == "right" && t[o].dataset.cornerX == "right" && (this.xOffset -= t[o].offsetWidth));
    }
    this.position = { prevX: this.xOffset, prevY: this.yOffset, x: this.xOffset, y: this.yOffset }, this.wrapper.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
  }
  _createElement(e) {
    e.el = e.el || "div";
    var t = document.createElement(e.el);
    if (e.id && (t.id = e.id), e.class && (t.className = e.class), e.inline && (t.style = e.inline), e.href && (t.href = e.href), e.onclick && (t.onclick = e.onclick), e.onchange && (t.onchange = e.onchange), e.textContent && (t.textContent = e.textContent), e.innerHTML && (t.innerHTML = e.innerHTML), e.type && (t.type = e.type), e.value && (t.value = e.value), e.customAttributes)
      for (var o in e.customAttributes)
        t.setAttribute(o, e.customAttributes[o]);
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
    let o = "";
    typeof e != "string" ? typeof e == "object" && (e != null && e.hasOwnProperty("name")) ? o = e.name == "" ? " " : e.name : o = " " : o = e == "" ? " " : e, this.imageContainer = null, typeof t != "function" && (t = () => {
    });
    const a = this._createElement({
      class: "p-gui__button",
      textContent: o,
      onclick: t
    });
    typeof e.color == "string" && (a.style.setProperty("--color-accent", e.color), a.style.setProperty("--color-accent-hover", e.hoverColor || e.color));
  }
  image(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] image() first parameter must be an object. Received: ${typeof e}.`);
    let o;
    if (typeof e.path == "string")
      o = e.path;
    else
      throw typeof e.path == null ? Error("[GUI] image() path must be provided.") : Error("[GUI] image() path must be a string.");
    let a = o.replace(/^.*[\\\/]/, ""), s;
    e.name == null ? s = a : s = typeof e.name == "string" && e.name || " ";
    let r = !1, i = null, n = e.obj || e.object, l = e.prop || e.property;
    const f = e.selected === !0, d = e.selectionBorder !== !1;
    if (e.selected !== void 0 || e.selected === void 0 && n === void 0 && l === void 0)
      (l != null || n != null) && console.warn('[GUI] image() "obj" and "property" parameters are ignored when a "selected" parameter is used.');
    else if (l != null && n != null) {
      if (typeof l != "string")
        throw Error(`[GUI] image() "prop" (or "property") parameter must be an string. Received: ${typeof l}.`);
      if (typeof n != "object")
        throw Error(`[GUI] image() "obj" (or "object") parameter must be an object. Received: ${typeof n}.`);
      s == " " && (s = l), i = this.propReferences.push(n[l]) - 1, r = !0;
    } else
      (l != null && n == null || l == null && n == null) && console.warn('[GUI] image() "obj" and "prop" parameters must be used together.');
    let p = "";
    e.width && (typeof e.width == "number" && (e.width += "px"), p += `flex: 0 0 calc(${e.width} - 5px); `), e.height && (typeof e.height == "number" && (e.height += "px"), p += `height: ${e.height}; `), this.imageContainer || (this.imageContainer = this._createElement({
      class: "p-gui__image-container"
    }));
    var c = this._createElement({
      class: "p-gui__image",
      inline: "background-image: url(" + o + "); " + p,
      parent: this.imageContainer
    });
    f && d && c.classList.add("p-gui__image--selected"), this._createElement({
      parent: c,
      class: "p-gui__image-text",
      textContent: s
    }), c.onclick = () => {
      let h = this.imageContainer.querySelectorAll(".p-gui__image--selected");
      for (let b = 0; b < h.length; b++)
        h[b].classList.remove("p-gui__image--selected");
      d && c.classList.add("p-gui__image--selected"), r ? n[l] = !0 : typeof t == "function" && t({ path: o, text: s });
    }, r && Object.defineProperty(n, l, {
      set: (h) => {
        if (this.propReferences[i] = h, h) {
          let b = this.imageContainer.querySelectorAll(".p-gui__image--selected");
          for (let u = 0; u < b.length; u++)
            b[u].classList.remove("p-gui__image--selected");
          d && c.classList.add("p-gui__image--selected"), typeof t == "function" && t({ path: o, text: s });
        } else
          c.classList.remove("p-gui__image--selected");
      },
      get: () => this.propReferences[i]
    });
  }
  slider(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] slider() first parameter must be an object. Received: ${typeof e}.`);
    let o = typeof e.name == "string" && e.name || " ", a = !1, s = null, r = e.obj || e.object, i = e.prop || e.property, n = typeof e.value == "number" ? e.value : null, l = e.min ?? 0, f = e.max ?? 1, d = e.step || (f - l) / 100;
    if (n !== null)
      (i != null || r != null) && console.warn('[GUI] slider() "obj" and "property" parameters are ignored when a "value" parameter is used.');
    else if (i != null && r != null) {
      if (typeof i != "string")
        throw Error(`[GUI] slider() "prop" (or "property") parameter must be an string. Received: ${typeof i}.`);
      if (typeof r != "object")
        throw Error(`[GUI] slider() "obj" (or "object") parameter must be an object. Received: ${typeof r}.`);
      o == " " && (o = i), s = this.propReferences.push(r[i]) - 1, a = !0;
    } else
      (i != null && r == null || i == null && r == null) && console.warn('[GUI] slider() "obj" and "prop" parameters must be used together.'), n = (f - l) / 2;
    this.imageContainer = null;
    var p = this._createElement({
      class: "p-gui__slider",
      textContent: o
    }), c = this._createElement({
      parent: p,
      el: "input",
      class: "p-gui__slider-ctrl",
      customAttributes: {
        type: "range",
        min: l,
        max: f,
        step: d,
        value: a ? r[i] : n
      }
    }), h = this._createElement({
      parent: p,
      class: "p-gui__slider-value",
      textContent: String(a ? r[i] : n)
    });
    c.addEventListener("input", () => {
      h.textContent = c.value, a ? r[i] = c.value : typeof t == "function" && t(parseFloat(c.value));
    }), a && Object.defineProperty(r, i, {
      set: (b) => {
        this.propReferences[s] = b, c.value = b, h.textContent = String(b), typeof t == "function" && t(parseFloat(c.value));
      },
      get: () => this.propReferences[s]
    });
  }
  toggle(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] toggle() first parameter must be an object. Received: ${typeof e}.`);
    let o = typeof e.name == "string" && e.name || " ", a = !1, s = null, r = e.obj || e.object, i = e.prop || e.property, n = typeof e.value == "boolean" ? e.value : null;
    if (n !== null)
      (i != null || r != null) && console.warn('[GUI] toggle() "obj" and "property" parameters are ignored when a "value" parameter is used.');
    else if (i != null && r != null) {
      if (typeof i != "string")
        throw Error(`[GUI] toggle() "prop" (or "property") parameter must be an string. Received: ${typeof i}.`);
      if (typeof r != "object")
        throw Error(`[GUI] toggle() "obj" (or "object") parameter must be an object. Received: ${typeof r}.`);
      o == " " && (o = i), s = this.propReferences.push(r[i]) - 1, a = !0;
    } else
      (i != null && r == null || i == null && r == null) && console.warn('[GUI] toggle() "obj" and "prop" parameters must be used together.');
    this.imageContainer = null;
    const l = this._createElement({
      class: "p-gui__switch",
      onclick: (p) => {
        const c = p.target.childNodes[1];
        let h = !0;
        c.classList.contains("p-gui__switch-checkbox--active") && (h = !1), c.classList.toggle("p-gui__switch-checkbox--active"), a ? r[i] = h : typeof t == "function" && t(h);
      },
      textContent: o
    });
    let f = (() => a ? r[i] ? " p-gui__switch-checkbox--active" : "" : n ? " p-gui__switch-checkbox--active" : "")();
    const d = this._createElement({
      parent: l,
      class: "p-gui__switch-checkbox" + f
    });
    a && Object.defineProperty(r, i, {
      set: (p) => {
        this.propReferences[s] = p, p ? d.classList.add("p-gui__switch-checkbox--active") : d.classList.remove("p-gui__switch-checkbox--active"), typeof t == "function" && t(p);
      },
      get: () => this.propReferences[s]
    });
  }
  list(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] list() first parameter must be an object. Received: ${typeof e}.`);
    let o = typeof e.name == "string" ? e.name : " ", a = !1, s = null, r = e.obj || e.object, i = e.prop || e.property, n = Array.isArray(e.values) ? e.values : null, l;
    if (t = typeof t == "function" ? t : null, e.value !== void 0 || e.value === void 0 && r === void 0 && i === void 0)
      (i != null || r != null) && console.warn('[GUI] list() "obj" and "property" parameters are ignored when a "value" parameter is used.'), l = (() => {
        if (!n)
          return null;
        if (typeof e.value == "string")
          return n.indexOf(e.value);
        if (typeof e.value == "number")
          return e.value;
      })();
    else if (i != null && r != null) {
      if (typeof i != "string")
        throw Error(`[GUI] list() "prop" (or "property") parameter must be an string. Received: ${typeof i}.`);
      if (typeof r != "object")
        throw Error(`[GUI] list() "obj" (or "object") parameter must be an object. Received: ${typeof r}.`);
      l = (() => {
        if (!n)
          return null;
        if (typeof r[i] == "string")
          return n.indexOf(r[i]);
        if (typeof r[i] == "number")
          return r[i];
      })(), o == " " && (o = i), s = this.propReferences.push(r[i]) - 1, a = !0;
    } else
      (i != null && r == null || i == null && r == null) && console.warn('[GUI] list() "obj" and "prop" parameters must be used together.');
    this.imageContainer = null;
    let f = this._createElement({
      class: "p-gui__list",
      textContent: o
    }), d = this._createElement({
      parent: f,
      el: "select",
      class: "p-gui__list-dropdown",
      onchange: (p) => {
        a ? r[i] = p.target.value : t && t(p.target.value);
      }
    });
    n && n.forEach((p, c) => {
      let h = this._createElement({
        parent: d,
        el: "option",
        customAttributes: {
          value: p
        },
        textContent: p
      });
      l == c && h.setAttribute("selected", "");
    }), a && Object.defineProperty(r, i, {
      set: (p) => {
        typeof p == "string" && (l = n.indexOf(p)), typeof p == "number" && (l = p), this.propReferences[s] = l, d.querySelector("[selected]").removeAttribute("selected"), d.querySelectorAll("option")[l].setAttribute("selected", ""), typeof t == "function" && t(l);
      },
      get: () => this.propReferences[s]
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
    let o = typeof e.name == "string" && e.name || " ";
    const a = e.x.min ?? 0, s = e.x.max ?? 1, r = e.y.min ?? 0, i = e.y.max ?? 1, n = e.x.obj || e.x.object, l = e.x.prop || e.x.property, f = this.propReferences.push(n[l]) - 1, d = e.y.obj || e.y.object, p = e.y.prop || e.y.property, c = this.propReferences.push(d[p]) - 1;
    t = typeof t == "function" ? t : null, this.imageContainer = null;
    const h = this._createElement({
      class: "p-gui__vector2",
      textContent: o
    }), b = this._createElement({
      parent: h,
      class: "p-gui__vector-value",
      textContent: n[l] + ", " + d[p]
    }), u = this._createElement({
      parent: h,
      el: "div",
      class: "p-gui__vector2-area",
      onclick: (g) => {
        n[l] = parseFloat(this._mapLinear(g.offsetX, 0, u.clientWidth, a, s).toFixed(2)), d[p] = parseFloat(this._mapLinear(g.offsetY, 0, u.clientHeight, i, r).toFixed(2)), t && t(n[l], n[p]);
      }
    });
    let y = !1;
    u.addEventListener("pointerdown", (g) => {
      y = !0;
    }), u.addEventListener("pointerup", () => {
      y = !1;
    }), u.addEventListener("pointermove", (g) => {
      y && (n[l] = parseFloat(this._mapLinear(g.offsetX, 0, u.clientWidth, a, s).toFixed(2)), d[p] = parseFloat(this._mapLinear(g.offsetY, 0, u.clientHeight, i, r).toFixed(2)), t && t(n[l], n[p]));
    }), this._createElement({
      parent: u,
      class: "p-gui__vector2-line p-gui__vector2-line-x"
    }), this._createElement({
      parent: u,
      class: "p-gui__vector2-line p-gui__vector2-line-y"
    });
    const x = this._createElement({
      parent: u,
      class: "p-gui__vector2-dot"
    });
    x.style.left = this._mapLinear(n[l], a, s, 0, u.clientWidth) + "px", x.style.top = this._mapLinear(d[p], r, i, u.clientHeight, 0) + "px", Object.defineProperty(n, l, {
      set: (g) => {
        this.propReferences[f] = g, x.style.left = this._mapLinear(g, a, s, 0, u.clientWidth) + "px", b.textContent = String(g) + ", " + d[p];
      },
      get: () => this.propReferences[f]
    }), Object.defineProperty(d, p, {
      set: (g) => {
        this.propReferences[c] = g, x.style.top = this._mapLinear(g, r, i, u.clientHeight, 0) + "px", b.textContent = n[l] + ", " + String(g);
      },
      get: () => this.propReferences[c]
    });
  }
  color(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] color() first parameter must be an object. Received: ${typeof e}.`);
    let o = typeof e.name == "string" && e.name || " ", a = !1, s = null, r = e.obj || e.object, i = e.prop || e.property, n;
    if (typeof e.value == "string" && (e.value.length != 7 || e.value[0] != "#" ? console.error(`[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${e.value}".`) : n = e.value), n || (n = "#000000"), e.value !== void 0)
      (i != null || r != null) && console.warn('[GUI] color() "obj" and "property" parameters are ignored when a "value" parameter is used.');
    else if (i != null && r != null) {
      if (typeof i != "string")
        throw Error(`[GUI] color() "prop" (or "property") parameter must be an string. Received: ${typeof i}.`);
      if (typeof r != "object")
        throw Error(`[GUI] color() "obj" (or "object") parameter must be an object. Received: ${typeof r}.`);
      o == " " && (o = i), s = this.propReferences.push(r[i]) - 1, a = !0;
    } else
      (i != null && r == null || i == null && r == null) && console.warn('[GUI] color() "obj" and "prop" parameters must be used together.');
    this.imageContainer = null;
    const l = this._createElement({
      el: "div",
      class: "p-gui__color",
      textContent: o
    }), f = this._createElement({
      parent: l,
      el: "input",
      class: "p-gui__color-picker",
      type: "color",
      value: n
    });
    typeof t == "function" && f.addEventListener("input", () => {
      a ? r[i] = f.value : typeof t == "function" && t(f.value);
    }), a && Object.defineProperty(r, i, {
      set: (d) => {
        this.propReferences[s] = d, f.value = d, typeof t == "function" && t(d);
      },
      get: () => this.propReferences[s]
    });
  }
  folder(e = {}) {
    let t = typeof e.closed == "boolean" ? e.closed : !1, o = e.name || "", a = e.color || null, s = e.maxHeight || null;
    this.imageContainer = null;
    let r = "p-gui__folder";
    this.folders.length == 0 && (r += " p-gui__folder--first"), t && (r += " p-gui__folder--closed");
    let i = a ? `background-color: ${a};` : "";
    i += s ? `max-height: ${s}px;` : "";
    let n = this._createElement({
      class: r,
      inline: i
    });
    this._createElement({
      innerHTML: `<span class="p-gui__folder-arrow"></span>${o}`,
      class: "p-gui__folder-header",
      onclick: function() {
        this.parentNode.classList.toggle("p-gui__folder--closed");
      },
      parent: n
    });
    let l = new _({ isFolder: !0, folderOptions: {
      wrapper: n
    } });
    return this.folders.push(l), l;
  }
  _makeDraggable() {
    var e = this;
    this.header.addEventListener("pointerdown", t), this.header.addEventListener("pointerup", a);
    function t(s) {
      s.preventDefault(), e.position.initX = e.position.x, e.position.initY = e.position.y, e.position.prevX = s.clientX, e.position.prevY = s.clientY, document.addEventListener("pointermove", o);
    }
    function o(s) {
      s.preventDefault(), e.hasBeenDragged || (e.hasBeenDragged = !0, e.wrapper.setAttribute("data-dragged", "true")), e.position.x = e.position.initX + s.clientX - e.position.prevX, e.position.y = e.position.initY + s.clientY - e.position.prevY, e.wrapper.style.transform = "translate3d(" + e.position.x + "px," + e.position.y + "px,0)";
    }
    function a(s) {
      document.removeEventListener("pointermove", o);
    }
  }
  toggleClose() {
    this.closed = !this.closed, this.wrapper.classList.toggle("p-gui--collapsed");
  }
  kill() {
    this.wrapper.remove();
  }
  _mapLinear(e, t, o, a, s) {
    return a + (e - t) * (s - a) / (o - t);
  }
}
export {
  _ as default
};
