class E {
  constructor(e = {}, t) {
    if (this.propReferences = [], typeof e != "object")
      throw Error(`[GUI] slider() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ";
    this.isObject = !1;
    let l = null;
    this.obj = e.obj, this.prop = e.prop;
    let a = typeof e.value == "number" ? e.value : null;
    if (this.min = e.min ?? 0, this.max = e.max ?? 1, this.step = e.step || (this.max - this.min) / 100, a !== null)
      (this.prop != null || this.obj != null) && console.warn('[GUI] slider() "obj" and "prop" parameters are ignored when a "value" parameter is used.');
    else if (this.prop != null && this.obj != null) {
      if (typeof this.prop != "string")
        throw Error(`[GUI] slider() "prop" parameter must be an string. Received: ${typeof this.prop}.`);
      if (typeof this.obj != "object")
        throw Error(`[GUI] slider() "obj" parameter must be an object. Received: ${typeof this.obj}.`);
      i == " " && (i = this.prop), l = this.propReferences.push(this.obj[this.prop]) - 1, this.isObject = !0;
    } else
      (this.prop != null && this.obj == null || this.prop == null && this.obj != null) && console.warn('[GUI] slider() "obj" and "prop" parameters must be used together.'), a = (this.max - this.min) / 2;
    const o = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    this.imageContainer = null;
    const n = document.createElement("div");
    n.className = "p-gui__slider", o && n.setAttribute("title", o);
    const r = document.createElement("div");
    r.className = "p-gui__slider-name", r.textContent = i, n.append(r), this.ctrlDiv = document.createElement("div"), this.ctrlDiv.className = "p-gui__slider-ctrl", this.ctrlDiv.setAttribute("type", "range"), this.ctrlDiv.setAttribute("min", this.min), this.ctrlDiv.setAttribute("max", this.max), n.append(this.ctrlDiv);
    const d = document.createElement("div");
    return d.className = "p-gui__slider-bar", this.ctrlDiv.append(d), this.handle = document.createElement("div"), this.handle.className = "p-gui__slider-handle", this.ctrlDiv.append(this.handle), this.filling = document.createElement("div"), this.filling.className = "p-gui__slider-filling", d.append(this.filling), this.valueInput = document.createElement("input"), this.valueInput.className = "p-gui__slider-value", this.valueInput.value = this.isObject ? this.obj[this.prop] : a, n.append(this.valueInput), setTimeout(() => {
      const s = this.handle.offsetWidth;
      this.handle.position = this._mapLinear(this.valueInput.value, this.min, this.max, s / 2, 88 - s / 2), this.handle.style.transform = `translate(-50%, -50%) translateX(${this.handle.position}px)`, this.filling.style.width = `${this.handle.position}px`;
    }, 0), this.valueInput.addEventListener("change", () => {
      this._updateHandlePositionFromValue(), this._triggerCallbacks();
    }), this.ctrlDiv.addEventListener("pointerdown", (s) => {
      this.ctrlDiv.pointerDown = !0, this.ctrlDiv.prevPosition = s.clientX, this._updateHandlePositionFromPointer(s, !0);
    }), window.addEventListener("pointerup", (s) => {
      this.ctrlDiv.pointerDown = !1;
    }), window.addEventListener("pointermove", (s) => {
      this.ctrlDiv.pointerDown && (this.ctrlDiv.pointerDelta = s.clientX - this.ctrlDiv.prevPosition, this._updateHandlePositionFromPointer(s));
    }), this.isObject && Object.defineProperty(this.obj, this.prop, {
      set: (s) => {
        this.propReferences[l] = s, this.valueInput.value = s, this._updateHandlePositionFromValue(), typeof t == "function" && t(parseFloat(this.valueInput.value));
      },
      get: () => this.propReferences[l]
    }), n;
  }
  _updateHandlePositionFromPointer(e, t = !1) {
    const i = this.ctrlDiv.offsetWidth, l = this.handle.offsetWidth, a = e.clientX - this.ctrlDiv.prevPosition;
    let o;
    const n = parseFloat(this.valueInput.value);
    t ? o = e.offsetX : o = this.handle.position + a, o = Math.max(l / 2, Math.min(o, i - l / 2));
    let r = this.min + (this.max - this.min) * (o - l / 2) / (i - l);
    r > n ? r = this._quantizeFloor(r, this.step) : r = this._quantizeCeil(r, this.step), r = parseFloat(r.toFixed(9));
    const d = parseFloat((n + this.step).toFixed(9)), s = parseFloat((n - this.step).toFixed(9));
    if (r >= d || r <= s) {
      const p = this._countDecimals(this.step);
      r = r.toFixed(p), this.valueInput.value = r, this.ctrlDiv.prevPosition = e.clientX, this.handle.style.transform = `translate(-50%, -50%) translateX(${o}px)`, this.handle.position = o, this.filling.style.width = this.handle.position + "px", this._triggerCallbacks();
    }
  }
  _countDecimals(e) {
    const t = e.toString(), i = t.indexOf(".");
    return i === -1 ? 0 : t.length - i - 1;
  }
  _updateHandlePositionFromValue() {
    const e = this.ctrlDiv.offsetWidth, t = this.handle.offsetWidth;
    let i = this._mapLinear(this.valueInput.value, this.min, this.max, t / 2, e - t / 2);
    i = Math.max(t / 2, Math.min(i, e - t / 2)), this.handle.style.transform = `translate(-50%, -50%) translateX(${i}px)`, this.handle.position = i, this.filling.style.width = this.handle.position + "px";
  }
  _triggerCallbacks() {
    this.isObject ? this.obj[this.prop] = parseFloat(this.valueInput.value) : typeof callback == "function" && callback(parseFloat(this.valueInput.value)), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
  }
  _mapLinear(e, t, i, l, a) {
    return l + (e - t) * (a - l) / (i - t);
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
}
const k = (
  /* css */
  `
.p-gui__button {
    background: var(--color-accent);
    text-align: center;
    color: white;
    border: none;
    border: 1px solid transparent;
    box-sizing: border-box;
    transition: var(--transition) background, var(--transition) border-color;
}

.p-gui__button:hover {
    background: var(--color-accent-hover);
    color: var(--color-text-light);
    border-color: rgba(255, 255, 255, 0.2);
}

.p-gui__folder .p-gui__button {
    margin-inline: 0;
}
`
), U = (
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
    height: 150%;
    background: var(--color-accent);
    width: 0;
}

.p-gui__slider:hover .p-gui__slider-filling {
    background: var(--color-accent-hover);
}

.p-gui__slider-handle {
    width: 15px;
    height: 8px;
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
), j = (
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
    height: 21px;
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid var(--color-border-2);
    outline: none;
}

.p-gui__list-dropdown:hover {
    background: rgba(255, 255, 255, .1);
}
`
), I = (
  /* css */
  `
.p-gui__switch {
    background: rgba(255, 255, 255, .05);
    color: var(--color-text-dark);
    transition: var(--transition) background, var(--transition) color;
}

.p-gui__switch:hover {
    background: rgba(255, 255, 255, .1);
    color: var(--color-text-light);
}

.p-gui__folder .p-gui__switch {
    margin-inline: 0;
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
`
), C = (
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
    height: 21px;
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
), R = (
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
), P = (
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
), O = (
  /* css */
  `
    .p-gui__folder {
        width: 100%;
        position: relative;
        background: #434343;
        overflow: auto;
        margin-bottom: 3px;
        display: flex;
        flex-wrap: wrap;
        border: 1px solid grey;
        padding: 0 3px 3px 3px;
        border-radius: var(--main-border-radius);
        box-sizing: border-box;
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
function $(w) {
  return (
    /* css */
    `
    .p-gui {
        --main-border-radius: 5px;
        --color-bg: #121212;
        --color-border: #484848;
        --color-border-2: rgba(255,255,255,.1);
        --color-text-light: #ffffff;
        --color-text-dark: #bbbbbb;
        --color-accent: #1681ca;
        --color-accent-hover: #218fda;
        --transition: .1s linear;
    
        position: ${w};
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
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
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
    .p-gui__switch,
    .p-gui__list,
    .p-gui__vector2,
    .p-gui__color {
        width: 100%;
        padding: 7px;
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
    .p-gui__switch:hover,
    .p-gui__list:hover,
    .p-gui__vector2:hover,
    .p-gui__color:hover {
        border-color: rgba(255,255,255,.2);
    }   
    
    ${k}
    
    ${P}
    
    ${j}
    
    ${I}

    ${U}
    
    ${C}
    
    ${R}
    
    ${O}
`
  );
}
class A {
  constructor(e = {}) {
    if (this.firstParent = this, e.container ? (this.container = typeof e.container == "string" ? document.querySelector(e.container) : e.container, this.position_type = "absolute") : (this.container = document.body, this.position_type = "fixed"), this.propReferences = [], this.folders = [], e.isFolder) {
      this._folderConstructor(e.folderOptions);
      return;
    }
    typeof e.onUpdate == "function" && (this.onUpdate = e.onUpdate), this.name = e != null && typeof e.name == "string" ? e.name : "", this.backgroundColor = e.color || null, this.opacity = e.opacity || 1, this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight), e.maxHeight && (this.initMaxHeight = e.maxHeight, this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.screenCorner = this._parseScreenCorner(e.position), window.perfectGUI || (window.perfectGUI = {}), window.perfectGUI.instanceCounter == null ? window.perfectGUI.instanceCounter = 0 : window.perfectGUI.instanceCounter++, this.instanceId = window.perfectGUI.instanceCounter, this.wrapperWidth = e.width || 290, this.stylesheet = document.createElement("style"), this.stylesheet.setAttribute("type", "text/css"), this.stylesheet.setAttribute("id", "lm-gui-stylesheet"), document.head.append(this.stylesheet), this.instanceId == 0 && this._addStyles(`${$(this.position_type)}`), this._styleInstance(), this._addWrapper(), this.wrapper.setAttribute("data-corner-x", this.screenCorner.x), this.wrapper.setAttribute("data-corner-y", this.screenCorner.y), e.autoRepositioning != !1 && window.addEventListener("resize", this._handleResize.bind(this)), this._handleResize(), this.hasBeenDragged = !1, e.draggable == !0 && this._makeDraggable(), this.closed = !1, e.closed && this.toggleClose();
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
            opacity: ${this.opacity};
        }`);
  }
  _folderConstructor(e) {
    this.wrapper = e.wrapper, this.isFolder = !0, this.parent = e.parent, this.firstParent = e.firstParent;
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
  _addStyles(e) {
    this.stylesheet.innerHTML += e;
  }
  _addWrapper() {
    this.wrapper = document.createElement("div"), this.wrapper.id = "p-gui-" + this.instanceId, this.wrapper.className = "p-gui", this.container.append(this.wrapper), this.header = document.createElement("div"), this.header.className = "p-gui__header", this.header.textContent = this.name, this.header.style = `${this.backgroundColor ? "border-color: " + this.backgroundColor + ";" : ""}`, this.wrapper.append(this.header);
    const e = document.createElement("div");
    e.className = "p-gui__header-close", e.addEventListener("click", this.toggleClose.bind(this)), this.header.append(e);
  }
  button(e, t) {
    let i = "";
    typeof e != "string" ? typeof e == "object" && (e != null && e.hasOwnProperty("name")) ? i = e.name == "" ? " " : e.name : i = " " : i = e == "" ? " " : e;
    const l = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    this.imageContainer = null;
    const a = document.createElement("div");
    a.className = "p-gui__button", a.textContent = i, l && a.setAttribute("title", l), a.addEventListener("click", () => {
      this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate(), t && t();
    }), this.wrapper.append(a), typeof e.color == "string" && (a.style.setProperty("--color-accent", e.color), a.style.setProperty("--color-accent-hover", e.hoverColor || e.color));
  }
  image(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] image() first parameter must be an object. Received: ${typeof e}.`);
    let i;
    if (typeof e.path == "string")
      i = e.path;
    else
      throw typeof e.path == null ? Error("[GUI] image() path must be provided.") : Error("[GUI] image() path must be a string.");
    let l = i.replace(/^.*[\\\/]/, ""), a;
    e.name == null ? a = l : a = typeof e.name == "string" && e.name || " ";
    const o = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? a : null, n = e.selected === !0, r = e.selectionBorder !== !1;
    let d = "";
    e.width && (typeof e.width == "number" && (e.width += "px"), d += `flex: 0 0 calc(${e.width} - 5px); `), e.height && (typeof e.height == "number" && (e.height += "px"), d += `height: ${e.height}; `), this.imageContainer || (this.imageContainer = document.createElement("div"), this.imageContainer.className = "p-gui__image-container", this.wrapper.append(this.imageContainer));
    const s = document.createElement("div");
    s.className = "p-gui__image", s.style = "background-image: url(" + i + "); " + d, o && s.setAttribute("title", o), this.imageContainer.append(s), n && r && s.classList.add("p-gui__image--selected");
    const p = document.createElement("div");
    return p.className = "p-gui__image-text", p.textContent = a, s.append(p), s.addEventListener("click", () => {
      let c = s.parentElement.querySelectorAll(".p-gui__image--selected");
      for (let f = 0; f < c.length; f++)
        c[f].classList.remove("p-gui__image--selected");
      r && s.classList.add("p-gui__image--selected"), typeof t == "function" && t({ path: i, text: a }), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    }), s;
  }
  slider(e = {}, t) {
    const i = new E(e, t);
    this.wrapper.append(i);
  }
  toggle(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] toggle() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ", l = !1, a = null, o = e.obj, n = e.prop, r = typeof e.value == "boolean" ? e.value : null;
    if (r !== null)
      (n != null || o != null) && console.warn('[GUI] toggle() "obj" and "prop" parameters are ignored when a "value" parameter is used.');
    else if (n != null && o != null) {
      if (typeof n != "string")
        throw Error(`[GUI] toggle() "prop" parameter must be an string. Received: ${typeof n}.`);
      if (typeof o != "object")
        throw Error(`[GUI] toggle() "obj" parameter must be an object. Received: ${typeof o}.`);
      i == " " && (i = n), a = this.propReferences.push(o[n]) - 1, l = !0;
    } else
      (n != null && o == null || n == null && o == null) && console.warn('[GUI] toggle() "obj" and "prop" parameters must be used together.');
    const d = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    this.imageContainer = null;
    const s = document.createElement("div");
    s.textContent = i, s.className = "p-gui__switch", d && s.setAttribute("title", d), this.wrapper.append(s), s.addEventListener("click", (f) => {
      const u = f.target.childNodes[1];
      let g = !0;
      u.classList.contains("p-gui__switch-checkbox--active") && (g = !1), u.classList.toggle("p-gui__switch-checkbox--active"), l ? o[n] = g : typeof t == "function" && t(g), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    });
    let p = (() => l ? o[n] ? " p-gui__switch-checkbox--active" : "" : r ? " p-gui__switch-checkbox--active" : "")();
    const c = document.createElement("div");
    c.className = "p-gui__switch-checkbox" + p, s.append(c), l && Object.defineProperty(o, n, {
      set: (f) => {
        this.propReferences[a] = f, f ? c.classList.add("p-gui__switch-checkbox--active") : c.classList.remove("p-gui__switch-checkbox--active"), typeof t == "function" && t(f);
      },
      get: () => this.propReferences[a]
    });
  }
  list(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] list() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" ? e.name : " ", l = !1, a = null, o = e.obj, n = e.prop, r = Array.isArray(e.values) ? e.values : null, d, s = typeof r[0] != "string";
    const p = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    if (t = typeof t == "function" ? t : null, e.value !== void 0 || e.value === void 0 && o === void 0 && n === void 0)
      (n != null || o != null) && console.warn('[GUI] list() "obj" and "prop" parameters are ignored when a "value" parameter is used.'), d = (() => {
        if (!r)
          return null;
        if (typeof e.value == "string")
          return r.indexOf(e.value);
        if (typeof e.value == "number")
          return e.value;
      })();
    else if (n != null && o != null) {
      if (typeof n != "string")
        throw Error(`[GUI] list() "prop" parameter must be an string. Received: ${typeof n}.`);
      if (typeof o != "object")
        throw Error(`[GUI] list() "obj" parameter must be an object. Received: ${typeof o}.`);
      d = (() => {
        if (!r)
          return null;
        if (typeof o[n] == "string")
          return s ? r.find((u) => u.value === o[n]).value : r.indexOf(o[n]);
        if (typeof o[n] == "number")
          return s ? r.find((u) => u.value === o[n]).value : o[n];
      })(), a = this.propReferences.push(o[n]) - 1, l = !0;
    } else
      (n != null && o == null || n == null && o == null) && console.warn('[GUI] list() "obj" and "prop" parameters must be used together.');
    this.imageContainer = null;
    let c = document.createElement("div");
    c.className = "p-gui__list", c.textContent = i, p && c.setAttribute("title", p), this.wrapper.append(c);
    let f = document.createElement("select");
    c.append(f), f.className = "p-gui__list-dropdown", f.addEventListener("change", (u) => {
      l ? o[n] = u.target.value : t && t(u.target.value), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    }), r && r.forEach((u, g) => {
      const _ = s ? u.name : u, h = s ? u.value : u;
      let x = document.createElement("option");
      x.setAttribute("value", h), x.textContent = _, f.append(x), (!s && d == g || s && d == h) && x.setAttribute("selected", "");
    }), l && Object.defineProperty(o, n, {
      set: (u) => {
        let g, _, h;
        s ? (h = r.find((v) => v.value == u), _ = (h == null ? void 0 : h.value) || r[0].value, g = r.indexOf(h)) : (typeof u == "string" && (g = r.indexOf(u), _ = u), typeof u == "number" && (g = u, _ = r[u])), this.propReferences[a] = s ? _ : u;
        const x = f.querySelector("[selected]");
        x && x.removeAttribute("selected"), f.querySelectorAll("option")[g].setAttribute("selected", ""), typeof t == "function" && t(s ? h : _, g);
      },
      get: () => this.propReferences[a]
    });
  }
  vector2(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] vector2() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ";
    const l = e.x.min ?? 0, a = e.x.max ?? 1, o = e.y.min ?? 0, n = e.y.max ?? 1, r = e.x.obj, d = e.x.prop, s = this.propReferences.push(r[d]) - 1, p = e.y.obj, c = e.y.prop, f = this.propReferences.push(p[c]) - 1, u = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    t = typeof t == "function" ? t : null, this.imageContainer = null;
    const g = document.createElement("div");
    g.className = "p-gui__vector2", g.textContent = i, u && g.setAttribute("title", u), this.wrapper.append(g);
    const _ = document.createElement("div");
    _.className = "p-gui__vector-value", _.textContent = r[d] + ", " + p[c], g.append(_);
    const h = document.createElement("div");
    h.className = "p-gui__vector2-area", g.append(h), h.addEventListener("click", (b) => {
      r[d] = parseFloat(this._mapLinear(b.offsetX, 0, h.clientWidth, l, a).toFixed(2)), p[c] = parseFloat(this._mapLinear(b.offsetY, 0, h.clientHeight, n, o).toFixed(2)), t && t(r[d], r[c]), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    });
    let x = !1;
    h.addEventListener("pointerdown", (b) => {
      x = !0;
    }), h.addEventListener("pointerup", () => {
      x = !1;
    }), h.addEventListener("pointermove", (b) => {
      x && (r[d] = parseFloat(this._mapLinear(b.offsetX, 0, h.clientWidth, l, a).toFixed(2)), p[c] = parseFloat(this._mapLinear(b.offsetY, 0, h.clientHeight, n, o).toFixed(2)), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate(), t && t(r[d], r[c]));
    });
    const v = document.createElement("div");
    v.className = "p-gui__vector2-line p-gui__vector2-line-x", h.append(v);
    const y = document.createElement("div");
    y.className = "p-gui__vector2-line p-gui__vector2-line-y", h.append(y);
    const m = document.createElement("div");
    m.className = "p-gui__vector2-dot", h.append(m), m.style.left = this._mapLinear(r[d], l, a, 0, h.clientWidth) + "px", m.style.top = this._mapLinear(p[c], o, n, h.clientHeight, 0) + "px", Object.defineProperty(r, d, {
      set: (b) => {
        this.propReferences[s] = b, m.style.left = this._mapLinear(b, l, a, 0, h.clientWidth) + "px", _.textContent = String(b) + ", " + p[c];
      },
      get: () => this.propReferences[s]
    }), Object.defineProperty(p, c, {
      set: (b) => {
        this.propReferences[f] = b, m.style.top = this._mapLinear(b, o, n, h.clientHeight, 0) + "px", _.textContent = r[d] + ", " + String(b);
      },
      get: () => this.propReferences[f]
    });
  }
  color(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] color() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ", l = !1, a = null, o = e.obj, n = e.prop, r;
    const d = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    if (typeof e.value == "string" && (e.value.length != 7 || e.value[0] != "#" ? console.error(`[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${e.value}".`) : r = e.value), r || (r = "#000000"), e.value !== void 0)
      (n != null || o != null) && console.warn('[GUI] color() "obj" and "prop" parameters are ignored when a "value" parameter is used.');
    else if (n != null && o != null) {
      if (typeof n != "string")
        throw Error(`[GUI] color() "prop" parameter must be an string. Received: ${typeof n}.`);
      if (typeof o != "object")
        throw Error(`[GUI] color() "obj" parameter must be an object. Received: ${typeof o}.`);
      i == " " && (i = n), a = this.propReferences.push(o[n]) - 1, l = !0;
    } else
      (n != null && o == null || n == null && o == null) && console.warn('[GUI] color() "obj" and "prop" parameters must be used together.');
    this.imageContainer = null;
    const s = document.createElement("div");
    s.className = "p-gui__color", s.textContent = i, d && s.setAttribute("title", d), this.wrapper.append(s);
    const p = document.createElement("input");
    p.className = "p-gui__color-picker", p.setAttribute("type", "color"), p.value = r, s.append(p), typeof t == "function" && p.addEventListener("input", () => {
      l ? o[n] = p.value : typeof t == "function" && t(p.value), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    }), l && Object.defineProperty(o, n, {
      set: (c) => {
        this.propReferences[a] = c, p.value = c, typeof t == "function" && t(c);
      },
      get: () => this.propReferences[a]
    });
  }
  folder(e = {}) {
    let t = typeof e.closed == "boolean" ? e.closed : !1, i = e.name || "", l = e.color || null, a = e.maxHeight || null;
    this.imageContainer = null;
    let o = "p-gui__folder";
    this.folders.length == 0 && (o += " p-gui__folder--first"), t && (o += " p-gui__folder--closed");
    let n = l ? `background-color: ${l};` : "";
    n += a ? `max-height: ${a}px;` : "";
    const r = document.createElement("div");
    r.className = o, r.style = n, this.wrapper.append(r);
    const d = document.createElement("div");
    d.innerHTML = `<span class="p-gui__folder-arrow"></span>${i}`, d.className = "p-gui__folder-header", r.append(d), d.addEventListener("click", () => {
      r.classList.toggle("p-gui__folder--closed");
    });
    let s = new A({ isFolder: !0, folderOptions: {
      wrapper: r,
      parent: this,
      firstParent: this.firstParent
    } });
    return this.folders.push(s), s;
  }
  _makeDraggable() {
    var e = this;
    this.header.addEventListener("pointerdown", t), this.header.addEventListener("pointerup", l);
    function t(a) {
      a.preventDefault(), e.position.initX = e.position.x, e.position.initY = e.position.y, e.position.prevX = a.clientX, e.position.prevY = a.clientY, document.addEventListener("pointermove", i);
    }
    function i(a) {
      a.preventDefault(), e.hasBeenDragged || (e.hasBeenDragged = !0, e.wrapper.setAttribute("data-dragged", "true")), e.position.x = e.position.initX + a.clientX - e.position.prevX, e.position.y = e.position.initY + a.clientY - e.position.prevY, e.wrapper.style.transform = "translate3d(" + e.position.x + "px," + e.position.y + "px,0)";
    }
    function l(a) {
      document.removeEventListener("pointermove", i);
    }
  }
  toggleClose() {
    this.closed = !this.closed, this.closed ? (this.previousInnerScroll = this.wrapper.scrollTop, this.wrapper.scrollTo(0, 0)) : this.wrapper.scrollTo(0, this.previousInnerScroll), this.wrapper.classList.toggle("p-gui--collapsed");
  }
  kill() {
    this.wrapper.remove();
  }
  _mapLinear(e, t, i, l, a) {
    return l + (e - t) * (a - l) / (i - t);
  }
}
export {
  A as default
};
