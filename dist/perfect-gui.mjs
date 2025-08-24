class R {
  constructor(e, t = {}, i) {
    if (this.parent = e, this.propReferences = [], typeof t != "object")
      throw Error(`[GUI] slider() first parameter must be an object. Received: ${typeof t}.`);
    let a = typeof t.name == "string" && t.name || " ";
    this.isObject = !1;
    let s = null;
    this.obj = t.obj, this.prop = t.prop;
    let o = typeof t.value == "number" ? t.value : null;
    if (this.min = t.min ?? 0, this.max = t.max ?? 1, this.step = t.step || (this.max - this.min) / 100, this.decimals = this.parent._countDecimals(this.step), this.callback = typeof i == "function" ? i : null, o !== null)
      (this.prop != null || this.obj != null) && console.warn('[GUI] slider() "obj" and "prop" parameters are ignored when a "value" parameter is used.');
    else if (this.prop != null && this.obj != null) {
      if (typeof this.prop != "string")
        throw Error(`[GUI] slider() "prop" parameter must be an string. Received: ${typeof this.prop}.`);
      if (typeof this.obj != "object")
        throw Error(`[GUI] slider() "obj" parameter must be an object. Received: ${typeof this.obj}.`);
      a == " " && (a = this.prop), s = this.propReferences.push(this.obj[this.prop]) - 1, this.isObject = !0;
    } else
      (this.prop != null && this.obj == null || this.prop == null && this.obj != null) && console.warn('[GUI] slider() "obj" and "prop" parameters must be used together.'), o = (this.max - this.min) / 2;
    const r = typeof t.tooltip == "string" ? t.tooltip : t.tooltip === !0 ? a : null;
    this.imageContainer = null;
    const n = document.createElement("div");
    n.className = "p-gui__slider", r && n.setAttribute("title", r);
    const c = document.createElement("div");
    c.className = "p-gui__slider-name", c.textContent = a, n.append(c), this.ctrlDiv = document.createElement("div"), this.ctrlDiv.className = "p-gui__slider-ctrl", this.ctrlDiv.setAttribute("type", "range"), this.ctrlDiv.setAttribute("min", this.min), this.ctrlDiv.setAttribute("max", this.max), n.append(this.ctrlDiv);
    const l = document.createElement("div");
    return l.className = "p-gui__slider-bar", this.ctrlDiv.append(l), this.handle = document.createElement("div"), this.handle.className = "p-gui__slider-handle", this.ctrlDiv.append(this.handle), this.filling = document.createElement("div"), this.filling.className = "p-gui__slider-filling", l.append(this.filling), this.valueInput = document.createElement("input"), this.valueInput.className = "p-gui__slider-value", this.valueInput.value = this.isObject ? this.obj[this.prop] : o, n.append(this.valueInput), setTimeout(() => {
      const d = this.handle.offsetWidth;
      this.handle.position = this._mapLinear(this.valueInput.value, this.min, this.max, d / 2, 88 - d / 2), this.handle.position = Math.min(this.handle.position, 88 - d / 2), this.handle.position = Math.max(this.handle.position, d / 2), this.handle.style.transform = `translate(-50%, -50%) translateX(${this.handle.position}px)`, this.filling.style.width = `${this.handle.position}px`;
    }, 0), this.valueInput.addEventListener("change", () => {
      this._updateHandlePositionFromValue(), this._triggerCallbacks();
    }), this.ctrlDiv.addEventListener("pointerdown", (d) => {
      this.ctrlDiv.pointerDown = !0, this.ctrlDiv.prevPosition = d.clientX, this._updateHandlePositionFromPointer(d, !0);
    }), window.addEventListener("pointerup", (d) => {
      this.ctrlDiv.pointerDown = !1;
    }), window.addEventListener("pointermove", (d) => {
      this.ctrlDiv.pointerDown && (this.ctrlDiv.pointerDelta = d.clientX - this.ctrlDiv.prevPosition, this._updateHandlePositionFromPointer(d));
    }), this.isObject && Object.defineProperty(this.obj, this.prop, {
      set: (d) => {
        this.propReferences[s] = d, this.valueInput.value = d, this._updateHandlePositionFromValue(), this.callback && this.callback(parseFloat(this.valueInput.value));
      },
      get: () => this.propReferences[s]
    }), n;
  }
  _updateHandlePositionFromPointer(e, t = !1) {
    const i = this.ctrlDiv.offsetWidth, a = this.handle.offsetWidth, s = e.clientX - this.ctrlDiv.prevPosition, o = parseFloat(this.valueInput.value);
    let r;
    t ? r = e.offsetX : r = this.handle.position + s, r = Math.max(a / 2, Math.min(r, i - a / 2));
    let n = this.min + (this.max - this.min) * (r - a / 2) / (i - a);
    n > o ? n = this._quantizeFloor(n, this.step) : n = this._quantizeCeil(n, this.step), n = parseFloat(n.toFixed(9));
    const c = parseFloat((o + this.step).toFixed(9)), l = parseFloat((o - this.step).toFixed(9));
    (n >= c || n <= l) && (n = n.toFixed(this.decimals), this.valueInput.value = n, this.ctrlDiv.prevPosition = e.clientX, this.handle.style.transform = `translate(-50%, -50%) translateX(${r}px)`, this.handle.position = r, this.filling.style.width = this.handle.position + "px", this._triggerCallbacks());
  }
  _updateHandlePositionFromValue() {
    const e = this.ctrlDiv.offsetWidth, t = this.handle.offsetWidth;
    let i = this._mapLinear(this.valueInput.value, this.min, this.max, t / 2, e - t / 2);
    i = Math.max(t / 2, Math.min(i, e - t / 2)), this.handle.style.transform = `translate(-50%, -50%) translateX(${i}px)`, this.handle.position = i, this.filling.style.width = this.handle.position + "px";
  }
  _triggerCallbacks() {
    this.isObject ? this.obj[this.prop] = parseFloat(this.valueInput.value) : this.callback && this.callback(parseFloat(this.valueInput.value)), this.parent.onUpdate ? this.parent.onUpdate() : this.parent.isFolder && this.parent.firstParent.onUpdate && this.parent.firstParent.onUpdate();
  }
  _mapLinear(e, t, i, a, s) {
    return a + (e - t) * (s - a) / (i - t);
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
const P = (
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
), O = (
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
), $ = (
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

    option {
        background: white;
        color: black;
    }
}

.p-gui__list-dropdown:hover {
    background: rgba(255, 255, 255, .1);
}
`
), D = (
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
), F = (
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
), L = (
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
), H = (
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
), N = (
  /* css */
  `
    .p-gui__folder {
        width: 100%;
        position: relative;
        background: #333333;
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
function M(U) {
  return (
    /* css */
    `
    .p-gui {
        --main-border-radius: 3px;
        --color-bg: #121212;
        --color-border: #222222;
        --color-border-2: transparent;
        --color-text-light: #ffffff;
        --color-text-dark: #bbbbbb;
        --color-accent: #bbbbbb;
        --color-accent-hover: #dddddd;
        --transition: .1s linear;
    
        position: ${U};
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
    
    ${P}
    
    ${H}
    
    ${$}
    
    ${D}

    ${O}
    
    ${F}
    
    ${L}
    
    ${N}
`
  );
}
class C {
  constructor(e = {}) {
    if (this.firstParent = this, e.container ? (this.container = typeof e.container == "string" ? document.querySelector(e.container) : e.container, this.position_type = "absolute") : (this.container = document.body, this.position_type = "fixed"), this.propReferences = [], this.folders = [], e.isFolder) {
      this._folderConstructor(e.folderOptions);
      return;
    }
    typeof e.onUpdate == "function" && (this.onUpdate = e.onUpdate), this.name = e != null && typeof e.name == "string" ? e.name : "", this.backgroundColor = e.color || null, this.opacity = e.opacity || 1, this.container == document.body ? this.maxHeight = window.innerHeight : this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight), e.maxHeight && (this.initMaxHeight = e.maxHeight, this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight)), this.screenCorner = this._parseScreenCorner(e.position), window.perfectGUI || (window.perfectGUI = {}), window.perfectGUI.instanceCounter == null ? window.perfectGUI.instanceCounter = 0 : window.perfectGUI.instanceCounter++, this.instanceId = window.perfectGUI.instanceCounter, this.wrapperWidth = e.width || 290, this.stylesheet = document.createElement("style"), this.stylesheet.setAttribute("type", "text/css"), this.stylesheet.setAttribute("id", "lm-gui-stylesheet"), document.head.append(this.stylesheet), this.instanceId == 0 && this._addStyles(`${M(this.position_type)}`), this._styleInstance(), this._addWrapper(), this.wrapper.setAttribute("data-corner-x", this.screenCorner.x), this.wrapper.setAttribute("data-corner-y", this.screenCorner.y), e.autoRepositioning != !1 && window.addEventListener("resize", this._handleResize.bind(this)), this._handleResize(), this.hasBeenDragged = !1, e.draggable == !0 && this._makeDraggable(), this.closed = !1, e.closed && this.toggleClose();
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
    this.wrapper = document.createElement("div"), this.wrapper.id = "p-gui-" + this.instanceId, this.wrapper.className = "p-gui", this.wrapper.setAttribute("data-lenis-prevent", ""), this.container.append(this.wrapper), this.header = document.createElement("div"), this.header.className = "p-gui__header", this.header.textContent = this.name, this.header.style = `${this.backgroundColor ? "border-color: " + this.backgroundColor + ";" : ""}`, this.wrapper.append(this.header);
    const e = document.createElement("div");
    e.className = "p-gui__header-close", e.addEventListener("click", this.toggleClose.bind(this)), this.header.append(e);
  }
  button(e, t) {
    let i = "";
    typeof e != "string" ? typeof e == "object" && (e != null && e.hasOwnProperty("name")) ? i = e.name == "" ? " " : e.name : i = " " : i = e == "" ? " " : e;
    const a = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    this.imageContainer = null;
    const s = document.createElement("div");
    s.className = "p-gui__button", s.textContent = i, a && s.setAttribute("title", a), s.addEventListener("click", () => {
      t && t(), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    }), this.wrapper.append(s), typeof e.color == "string" && (s.style.setProperty("--color-accent", e.color), s.style.setProperty("--color-accent-hover", e.hoverColor || e.color));
  }
  image(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] image() first parameter must be an object. Received: ${typeof e}.`);
    let i;
    if (typeof e.path == "string")
      i = e.path;
    else
      throw typeof e.path == null ? Error("[GUI] image() path must be provided.") : Error("[GUI] image() path must be a string.");
    let a = i.replace(/^.*[\\\/]/, ""), s;
    e.name == null ? s = a : s = typeof e.name == "string" && e.name || " ";
    const o = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? s : null, r = e.selected === !0, n = e.selectionBorder !== !1;
    let c = "";
    e.width && (typeof e.width == "number" && (e.width += "px"), c += `flex: 0 0 calc(${e.width} - 5px); `), e.height && (typeof e.height == "number" && (e.height += "px"), c += `height: ${e.height}; `), this.imageContainer || (this.imageContainer = document.createElement("div"), this.imageContainer.className = "p-gui__image-container", this.wrapper.append(this.imageContainer));
    const l = document.createElement("div");
    l.className = "p-gui__image", l.style = "background-image: url(" + i + "); " + c, o && l.setAttribute("title", o), this.imageContainer.append(l), r && n && l.classList.add("p-gui__image--selected");
    const d = document.createElement("div");
    return d.className = "p-gui__image-text", d.textContent = s, l.append(d), l.addEventListener("click", () => {
      let p = l.parentElement.querySelectorAll(".p-gui__image--selected");
      for (let h = 0; h < p.length; h++)
        p[h].classList.remove("p-gui__image--selected");
      n && l.classList.add("p-gui__image--selected"), typeof t == "function" && t({ path: i, text: s }), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    }), l;
  }
  slider(e = {}, t) {
    const i = new R(this, e, t);
    this.wrapper.append(i);
  }
  toggle(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] toggle() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ", a = !1, s = null, o = e.obj, r = e.prop, n = typeof e.value == "boolean" ? e.value : null;
    if (n !== null)
      (r != null || o != null) && console.warn('[GUI] toggle() "obj" and "prop" parameters are ignored when a "value" parameter is used.');
    else if (r != null && o != null) {
      if (typeof r != "string")
        throw Error(`[GUI] toggle() "prop" parameter must be an string. Received: ${typeof r}.`);
      if (typeof o != "object")
        throw Error(`[GUI] toggle() "obj" parameter must be an object. Received: ${typeof o}.`);
      i == " " && (i = r), s = this.propReferences.push(o[r]) - 1, a = !0;
    } else
      (r != null && o == null || r == null && o == null) && console.warn('[GUI] toggle() "obj" and "prop" parameters must be used together.');
    const c = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    this.imageContainer = null;
    const l = document.createElement("div");
    l.textContent = i, l.className = "p-gui__switch", c && l.setAttribute("title", c), this.wrapper.append(l), l.addEventListener("click", (h) => {
      const u = h.target.childNodes[1];
      let f = !0;
      u.classList.contains("p-gui__switch-checkbox--active") && (f = !1), u.classList.toggle("p-gui__switch-checkbox--active"), a ? o[r] = f : typeof t == "function" && t(f), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    });
    let d = (() => a ? o[r] ? " p-gui__switch-checkbox--active" : "" : n ? " p-gui__switch-checkbox--active" : "")();
    const p = document.createElement("div");
    p.className = "p-gui__switch-checkbox" + d, l.append(p), a && Object.defineProperty(o, r, {
      set: (h) => {
        this.propReferences[s] = h, h ? p.classList.add("p-gui__switch-checkbox--active") : p.classList.remove("p-gui__switch-checkbox--active"), typeof t == "function" && t(h);
      },
      get: () => this.propReferences[s]
    });
  }
  list(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] list() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" ? e.name : " ", a = !1, s = null, o = e.obj, r = e.prop, n = Array.isArray(e.values) ? e.values : null, c, l = typeof n[0] != "string";
    const d = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    if (t = typeof t == "function" ? t : null, e.value !== void 0 || e.value === void 0 && o === void 0 && r === void 0)
      (r != null || o != null) && console.warn('[GUI] list() "obj" and "prop" parameters are ignored when a "value" parameter is used.'), c = (() => {
        if (!n)
          return null;
        if (typeof e.value == "string")
          return n.indexOf(e.value);
        if (typeof e.value == "number")
          return e.value;
      })();
    else if (r != null && o != null) {
      if (typeof r != "string")
        throw Error(`[GUI] list() "prop" parameter must be an string. Received: ${typeof r}.`);
      if (typeof o != "object")
        throw Error(`[GUI] list() "obj" parameter must be an object. Received: ${typeof o}.`);
      c = (() => {
        if (!n)
          return null;
        if (typeof o[r] == "string")
          return l ? n.find((u) => u.value === o[r]).value : n.indexOf(o[r]);
        if (typeof o[r] == "number")
          return l ? n.find((u) => u.value === o[r]).value : o[r];
      })(), s = this.propReferences.push(o[r]) - 1, a = !0;
    } else
      (r != null && o == null || r == null && o == null) && console.warn('[GUI] list() "obj" and "prop" parameters must be used together.');
    this.imageContainer = null;
    let p = document.createElement("div");
    p.className = "p-gui__list", p.textContent = i, d && p.setAttribute("title", d), this.wrapper.append(p);
    let h = document.createElement("select");
    p.append(h), h.className = "p-gui__list-dropdown", h.addEventListener("change", (u) => {
      a ? o[r] = u.target.value : t && t(u.target.value), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    }), n && n.forEach((u, f) => {
      const g = l ? u.name : u, m = l ? u.value : u;
      let x = document.createElement("option");
      x.setAttribute("value", m), x.textContent = g, h.append(x), (!l && c == f || l && c == m) && x.setAttribute("selected", "");
    }), a && Object.defineProperty(o, r, {
      set: (u) => {
        let f, g, m;
        l ? (m = n.find((v) => v.value == u), g = (m == null ? void 0 : m.value) || n[0].value, f = n.indexOf(m)) : (typeof u == "string" && (f = n.indexOf(u), g = u), typeof u == "number" && (f = u, g = n[u])), this.propReferences[s] = l ? g : u;
        const x = h.querySelector("[selected]");
        x && x.removeAttribute("selected"), h.querySelectorAll("option")[f].setAttribute("selected", ""), typeof t == "function" && t(l ? m : g, f);
      },
      get: () => this.propReferences[s]
    });
  }
  color(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] color() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ", a = !1, s = null, o = e.obj, r = e.prop, n;
    const c = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    if (typeof e.value == "string" && (e.value.length != 7 || e.value[0] != "#" ? console.error(`[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${e.value}".`) : n = e.value), n || (n = "#000000"), e.value !== void 0)
      (r != null || o != null) && console.warn('[GUI] color() "obj" and "prop" parameters are ignored when a "value" parameter is used.');
    else if (r != null && o != null) {
      if (typeof r != "string")
        throw Error(`[GUI] color() "prop" parameter must be an string. Received: ${typeof r}.`);
      if (typeof o != "object")
        throw Error(`[GUI] color() "obj" parameter must be an object. Received: ${typeof o}.`);
      i == " " && (i = r), s = this.propReferences.push(o[r]) - 1, a = !0;
    } else
      (r != null && o == null || r == null && o == null) && console.warn('[GUI] color() "obj" and "prop" parameters must be used together.');
    this.imageContainer = null;
    const l = document.createElement("div");
    l.className = "p-gui__color", l.textContent = i, c && l.setAttribute("title", c), this.wrapper.append(l);
    const d = document.createElement("input");
    d.className = "p-gui__color-picker", d.setAttribute("type", "color"), d.value = n, l.append(d), typeof t == "function" && d.addEventListener("input", () => {
      a ? o[r] = d.value : typeof t == "function" && t(d.value), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    }), a && Object.defineProperty(o, r, {
      set: (p) => {
        this.propReferences[s] = p, d.value = p, typeof t == "function" && t(p);
      },
      get: () => this.propReferences[s]
    });
  }
  vector2(e = {}, t) {
    if (typeof e != "object")
      throw Error(`[GUI] vector2() first parameter must be an object. Received: ${typeof e}.`);
    let i = typeof e.name == "string" && e.name || " ";
    const a = e.x.min ?? 0, s = e.x.max ?? 1, o = e.y.min ?? 0, r = e.y.max ?? 1, n = e.x.step || (s - a) / 100, c = e.y.step || (r - o) / 100, l = this._countDecimals(n), d = this._countDecimals(c), p = e.x.obj, h = e.x.prop, u = this.propReferences.push(p[h]) - 1, f = e.y.obj, g = e.y.prop, m = this.propReferences.push(f[g]) - 1, x = typeof e.tooltip == "string" ? e.tooltip : e.tooltip === !0 ? i : null;
    t = typeof t == "function" ? t : null, this.imageContainer = null;
    const v = document.createElement("div");
    v.className = "p-gui__vector2", v.textContent = i, x && v.setAttribute("title", x), this.wrapper.append(v);
    const y = document.createElement("div");
    y.className = "p-gui__vector-value", y.textContent = p[h] + ", " + f[g], v.append(y);
    const b = document.createElement("div");
    b.className = "p-gui__vector2-area", v.append(b), b.addEventListener("click", (_) => {
      const k = parseFloat(this._mapLinear(_.offsetX, 0, b.clientWidth, a, s)), E = parseFloat(this._mapLinear(_.offsetY, 0, b.clientHeight, r, o));
      p[h] = k.toFixed(l), f[g] = E.toFixed(d), t && t(p[h], p[g]), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
    });
    let A = !1;
    b.addEventListener("pointerdown", (_) => {
      A = !0;
    }), b.addEventListener("pointerup", () => {
      A = !1;
    }), b.addEventListener("pointermove", (_) => {
      if (A) {
        const k = parseFloat(this._mapLinear(_.offsetX, 0, b.clientWidth, a, s)), E = parseFloat(this._mapLinear(_.offsetY, 0, b.clientHeight, r, o));
        p[h] = k.toFixed(l), f[g] = E.toFixed(d), t && t(p[h], p[g]), this.onUpdate ? this.onUpdate() : this.isFolder && this.firstParent.onUpdate && this.firstParent.onUpdate();
      }
    });
    const j = document.createElement("div");
    j.className = "p-gui__vector2-line p-gui__vector2-line-x", b.append(j);
    const I = document.createElement("div");
    I.className = "p-gui__vector2-line p-gui__vector2-line-y", b.append(I);
    const w = document.createElement("div");
    w.className = "p-gui__vector2-dot", b.append(w), w.style.left = this._mapLinear(p[h], a, s, 0, b.clientWidth) + "px", w.style.top = this._mapLinear(f[g], o, r, b.clientHeight, 0) + "px", Object.defineProperty(p, h, {
      set: (_) => {
        this.propReferences[u] = _, w.style.left = this._mapLinear(_, a, s, 0, b.clientWidth) + "px", y.textContent = String(_) + ", " + f[g];
      },
      get: () => this.propReferences[u]
    }), Object.defineProperty(f, g, {
      set: (_) => {
        this.propReferences[m] = _, w.style.top = this._mapLinear(_, o, r, b.clientHeight, 0) + "px", y.textContent = p[h] + ", " + String(_);
      },
      get: () => this.propReferences[m]
    });
  }
  folder(e = {}) {
    let t = typeof e.closed == "boolean" ? e.closed : !1, i = e.name || "", a = e.color || null, s = e.maxHeight || null;
    this.imageContainer = null;
    let o = "p-gui__folder";
    this.folders.length == 0 && (o += " p-gui__folder--first"), t && (o += " p-gui__folder--closed");
    let r = a ? `background-color: ${a};` : "";
    r += s ? `max-height: ${s}px;` : "";
    const n = document.createElement("div");
    n.className = o, n.style = r, this.wrapper.append(n);
    const c = document.createElement("div");
    c.innerHTML = `<span class="p-gui__folder-arrow"></span>${i}`, c.className = "p-gui__folder-header", n.append(c), c.addEventListener("click", () => {
      n.classList.toggle("p-gui__folder--closed");
    });
    let l = new C({ isFolder: !0, folderOptions: {
      wrapper: n,
      parent: this,
      firstParent: this.firstParent
    } });
    return this.folders.push(l), l;
  }
  _makeDraggable() {
    var e = this;
    this.header.addEventListener("pointerdown", t), this.header.addEventListener("pointerup", a);
    function t(s) {
      s.preventDefault(), e.position.initX = e.position.x, e.position.initY = e.position.y, e.position.prevX = s.clientX, e.position.prevY = s.clientY, document.addEventListener("pointermove", i);
    }
    function i(s) {
      s.preventDefault(), e.hasBeenDragged || (e.hasBeenDragged = !0, e.wrapper.setAttribute("data-dragged", "true")), e.position.x = e.position.initX + s.clientX - e.position.prevX, e.position.y = e.position.initY + s.clientY - e.position.prevY, e.wrapper.style.transform = "translate3d(" + e.position.x + "px," + e.position.y + "px,0)";
    }
    function a(s) {
      document.removeEventListener("pointermove", i);
    }
  }
  toggleClose() {
    this.closed = !this.closed, this.closed ? (this.previousInnerScroll = this.wrapper.scrollTop, this.wrapper.scrollTo(0, 0)) : this.wrapper.scrollTo(0, this.previousInnerScroll), this.wrapper.classList.toggle("p-gui--collapsed");
  }
  kill() {
    this.wrapper.remove();
  }
  _mapLinear(e, t, i, a, s) {
    return a + (e - t) * (s - a) / (i - t);
  }
  _countDecimals(e) {
    const t = e.toString(), i = t.indexOf(".");
    return i === -1 ? 0 : t.length - i - 1;
  }
}
export {
  C as default
};
