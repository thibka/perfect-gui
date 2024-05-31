(function(w,x){typeof exports=="object"&&typeof module<"u"?module.exports=x():typeof define=="function"&&define.amd?define(x):(w=typeof globalThis<"u"?globalThis:w||self,w["Perfect GUI"]=x())})(this,function(){"use strict";function w(A){return`
    .p-gui {
        --main-border-radius: 5px;
        --color-bg: #121212;
        --color-border: #484848;
        --color-border-2: rgba(255,255,255,.1);
        --color-accent: #1681ca;
        --color-accent-hover: #218fda;
    
        position: ${A};
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
        line-height: normal;
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
        padding: 3px;
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
        outline: none;
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
        box-sizing: border-box;
        width: calc(100% - 10px);
        margin: 0 auto 10px auto;
        padding: 7px 0;
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
        border-radius: var(--main-border-radius);
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
        border: 1px solid grey;
        padding: 0 3px;
        border-radius: var(--main-border-radius);
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
    `}class x{constructor(e={}){if(e.container?(this.container=typeof e.container=="string"?document.querySelector(e.container):e.container,this.position_type="absolute"):(this.container=document.body,this.position_type="fixed"),this.propReferences=[],this.folders=[],e.isFolder){this._folderConstructor(e.folderOptions);return}typeof e.onUpdate=="function"&&(this.onUpdate=e.onUpdate),this.name=e!=null&&typeof e.name=="string"?e.name:"",this.backgroundColor=e.color||null,this.container==document.body?this.maxHeight=window.innerHeight:this.maxHeight=Math.min(this.container.clientHeight,window.innerHeight),e.maxHeight&&(this.initMaxHeight=e.maxHeight,this.maxHeight=Math.min(this.initMaxHeight,this.maxHeight)),this.screenCorner=this._parseScreenCorner(e.position),window.perfectGUI||(window.perfectGUI={}),window.perfectGUI.instanceCounter==null?window.perfectGUI.instanceCounter=0:window.perfectGUI.instanceCounter++,this.instanceId=window.perfectGUI.instanceCounter,this.wrapperWidth=e.width||290,this.stylesheet=document.createElement("style"),this.stylesheet.setAttribute("type","text/css"),this.stylesheet.setAttribute("id","lm-gui-stylesheet"),document.head.append(this.stylesheet),this.instanceId==0&&this._addStyles(`${w(this.position_type)}`),this._styleInstance(),this._addWrapper(),this.wrapper.setAttribute("data-corner-x",this.screenCorner.x),this.wrapper.setAttribute("data-corner-y",this.screenCorner.y),e.autoRepositioning!=!1&&window.addEventListener("resize",this._handleResize.bind(this)),this._handleResize(),this.hasBeenDragged=!1,e.draggable==!0&&this._makeDraggable(),this.closed=!1,e.closed&&this.toggleClose()}_styleInstance(){let e=this._getScrollbarWidth(this.container);if(this.screenCorner.x=="left"?this.xOffset=0:this.xOffset=this.container.clientWidth-this.wrapperWidth-e,this.instanceId>0){let t=this.container.querySelectorAll(".p-gui");for(let o=0;o<t.length;o++)this.screenCorner.y==t[o].dataset.cornerY&&(this.screenCorner.x=="left"&&t[o].dataset.cornerX=="left"?this.xOffset+=t[o].offsetWidth:this.screenCorner.x=="right"&&t[o].dataset.cornerX=="right"&&(this.xOffset-=t[o].offsetWidth))}this.yOffset=0,this.position={prevX:this.xOffset,prevY:this.yOffset,x:this.xOffset,y:this.yOffset},this._addStyles(`#p-gui-${this.instanceId} {
            width: ${this.wrapperWidth}px;
            max-height: ${this.maxHeight}px;
            transform: translate3d(${this.xOffset}px,${this.yOffset}px,0);
            ${this.screenCorner.y=="top"?"":"top: auto; bottom: 0;"}
            ${this.backgroundColor?"background: "+this.backgroundColor+";":""}
        }`)}_folderConstructor(e){this.wrapper=e.wrapper,this.isFolder=!0,this.parent=e.parent}_parseScreenCorner(e){let t={x:"right",y:"top"};return e==null||(typeof e!="string"&&console.error("[perfect-gui] Position must be a string."),e.includes("left")&&(t.x="left"),e.includes("bottom")&&(t.y="bottom")),t}_getScrollbarWidth(e){return e===document.body?window.innerWidth-document.documentElement.clientWidth:e.offsetWidth-e.clientWidth}_handleResize(){if(this.container==document.body?this.maxHeight=window.innerHeight:this.maxHeight=Math.min(this.container.clientHeight,window.innerHeight),this.initMaxHeight&&(this.maxHeight=Math.min(this.initMaxHeight,this.maxHeight)),this.wrapper.style.maxHeight=this.maxHeight+"px",this.hasBeenDragged)return;let e=this._getScrollbarWidth(this.container);if(this.xOffset=this.screenCorner.x=="left"?0:this.container.clientWidth-this.wrapperWidth-e,this.instanceId>0){let t=this.container.querySelectorAll(`.p-gui:not(#${this.wrapper.id}):not([data-dragged])`);for(let o=0;o<t.length&&!(parseInt(t[o].id.replace("p-gui-",""))>this.instanceId);o++)this.screenCorner.y==t[o].dataset.cornerY&&(this.screenCorner.x=="left"&&t[o].dataset.cornerX=="left"?this.xOffset+=t[o].offsetWidth:this.screenCorner.x=="right"&&t[o].dataset.cornerX=="right"&&(this.xOffset-=t[o].offsetWidth))}this.position={prevX:this.xOffset,prevY:this.yOffset,x:this.xOffset,y:this.yOffset},this.wrapper.style.transform=`translate3d(${this.position.x}px, ${this.position.y}px, 0)`}_addStyles(e){this.stylesheet.innerHTML+=e}_addWrapper(){this.wrapper=document.createElement("div"),this.wrapper.id="p-gui-"+this.instanceId,this.wrapper.className="p-gui",this.container.append(this.wrapper),this.header=document.createElement("div"),this.header.className="p-gui__header",this.header.textContent=this.name,this.header.style=`${this.backgroundColor?"border-color: "+this.backgroundColor+";":""}`,this.wrapper.append(this.header);const e=document.createElement("div");e.className="p-gui__header-close",e.addEventListener("click",this.toggleClose.bind(this)),this.header.append(e)}button(e,t){let o="";typeof e!="string"?typeof e=="object"&&(e!=null&&e.hasOwnProperty("name"))?o=e.name==""?" ":e.name:o=" ":o=e==""?" ":e,this.imageContainer=null;const a=document.createElement("div");a.className="p-gui__button",a.textContent=o,a.addEventListener("click",()=>{this.onUpdate?this.onUpdate():this.isFolder&&this.parent.onUpdate&&this.parent.onUpdate(),t&&t()}),this.wrapper.append(a),typeof e.color=="string"&&(a.style.setProperty("--color-accent",e.color),a.style.setProperty("--color-accent-hover",e.hoverColor||e.color))}image(e={},t){if(typeof e!="object")throw Error(`[GUI] image() first parameter must be an object. Received: ${typeof e}.`);let o;if(typeof e.path=="string")o=e.path;else throw typeof e.path==null?Error("[GUI] image() path must be provided."):Error("[GUI] image() path must be a string.");let a=o.replace(/^.*[\\\/]/,""),p;e.name==null?p=a:p=typeof e.name=="string"&&e.name||" ";const r=e.selected===!0,i=e.selectionBorder!==!1;let n="";e.width&&(typeof e.width=="number"&&(e.width+="px"),n+=`flex: 0 0 calc(${e.width} - 5px); `),e.height&&(typeof e.height=="number"&&(e.height+="px"),n+=`height: ${e.height}; `),this.imageContainer||(this.imageContainer=document.createElement("div"),this.imageContainer.className="p-gui__image-container",this.wrapper.append(this.imageContainer));const s=document.createElement("div");s.className="p-gui__image",s.style="background-image: url("+o+"); "+n,this.imageContainer.append(s),r&&i&&s.classList.add("p-gui__image--selected");const l=document.createElement("div");return l.className="p-gui__image-text",l.textContent=p,s.append(l),s.addEventListener("click",()=>{let f=s.parentElement.querySelectorAll(".p-gui__image--selected");for(let c=0;c<f.length;c++)f[c].classList.remove("p-gui__image--selected");i&&s.classList.add("p-gui__image--selected"),typeof t=="function"&&t({path:o,text:p}),this.onUpdate&&this.onUpdate()}),s}slider(e={},t){if(typeof e!="object")throw Error(`[GUI] slider() first parameter must be an object. Received: ${typeof e}.`);let o=typeof e.name=="string"&&e.name||" ",a=!1,p=null,r=e.obj,i=e.prop,n=typeof e.value=="number"?e.value:null,s=e.min??0,l=e.max??1,f=e.step||(l-s)/100;if(n!==null)(i!=null||r!=null)&&console.warn('[GUI] slider() "obj" and "prop" parameters are ignored when a "value" parameter is used.');else if(i!=null&&r!=null){if(typeof i!="string")throw Error(`[GUI] slider() "prop" parameter must be an string. Received: ${typeof i}.`);if(typeof r!="object")throw Error(`[GUI] slider() "obj" parameter must be an object. Received: ${typeof r}.`);o==" "&&(o=i),p=this.propReferences.push(r[i])-1,a=!0}else(i!=null&&r==null||i==null&&r!=null)&&console.warn('[GUI] slider() "obj" and "prop" parameters must be used together.'),n=(l-s)/2;this.imageContainer=null;const c=document.createElement("div");c.className="p-gui__slider",c.textContent=o,this.wrapper.append(c);const d=document.createElement("input");d.className="p-gui__slider-ctrl",d.setAttribute("type","range"),d.setAttribute("min",s),d.setAttribute("max",l),d.setAttribute("step",f),d.setAttribute("value",a?r[i]:n),c.append(d);const h=document.createElement("div");h.className="p-gui__slider-value",h.textContent=String(a?r[i]:n),c.append(h),d.addEventListener("input",()=>{h.textContent=d.value,a?r[i]=parseFloat(d.value):typeof t=="function"&&t(parseFloat(d.value)),this.onUpdate&&this.onUpdate()}),a&&Object.defineProperty(r,i,{set:g=>{this.propReferences[p]=g,d.value=g,h.textContent=String(g),typeof t=="function"&&t(parseFloat(d.value))},get:()=>this.propReferences[p]})}toggle(e={},t){if(typeof e!="object")throw Error(`[GUI] toggle() first parameter must be an object. Received: ${typeof e}.`);let o=typeof e.name=="string"&&e.name||" ",a=!1,p=null,r=e.obj,i=e.prop,n=typeof e.value=="boolean"?e.value:null;if(n!==null)(i!=null||r!=null)&&console.warn('[GUI] toggle() "obj" and "prop" parameters are ignored when a "value" parameter is used.');else if(i!=null&&r!=null){if(typeof i!="string")throw Error(`[GUI] toggle() "prop" parameter must be an string. Received: ${typeof i}.`);if(typeof r!="object")throw Error(`[GUI] toggle() "obj" parameter must be an object. Received: ${typeof r}.`);o==" "&&(o=i),p=this.propReferences.push(r[i])-1,a=!0}else(i!=null&&r==null||i==null&&r==null)&&console.warn('[GUI] toggle() "obj" and "prop" parameters must be used together.');this.imageContainer=null;const s=document.createElement("div");s.textContent=o,s.className="p-gui__switch",this.wrapper.append(s),s.addEventListener("click",c=>{const d=c.target.childNodes[1];let h=!0;d.classList.contains("p-gui__switch-checkbox--active")&&(h=!1),d.classList.toggle("p-gui__switch-checkbox--active"),a?r[i]=h:typeof t=="function"&&t(h),this.onUpdate&&this.onUpdate()});let l=(()=>a?r[i]?" p-gui__switch-checkbox--active":"":n?" p-gui__switch-checkbox--active":"")();const f=document.createElement("div");f.className="p-gui__switch-checkbox"+l,s.append(f),a&&Object.defineProperty(r,i,{set:c=>{this.propReferences[p]=c,c?f.classList.add("p-gui__switch-checkbox--active"):f.classList.remove("p-gui__switch-checkbox--active"),typeof t=="function"&&t(c)},get:()=>this.propReferences[p]})}list(e={},t){if(typeof e!="object")throw Error(`[GUI] list() first parameter must be an object. Received: ${typeof e}.`);let o=typeof e.name=="string"?e.name:" ",a=!1,p=null,r=e.obj,i=e.prop,n=Array.isArray(e.values)?e.values:null,s,l=typeof n[0]!="string";if(t=typeof t=="function"?t:null,e.value!==void 0||e.value===void 0&&r===void 0&&i===void 0)(i!=null||r!=null)&&console.warn('[GUI] list() "obj" and "prop" parameters are ignored when a "value" parameter is used.'),s=(()=>{if(!n)return null;if(typeof e.value=="string")return n.indexOf(e.value);if(typeof e.value=="number")return e.value})();else if(i!=null&&r!=null){if(typeof i!="string")throw Error(`[GUI] list() "prop" parameter must be an string. Received: ${typeof i}.`);if(typeof r!="object")throw Error(`[GUI] list() "obj" parameter must be an object. Received: ${typeof r}.`);s=(()=>{if(!n)return null;if(typeof r[i]=="string")return l?n.find(d=>d.value===r[i]).value:n.indexOf(r[i]);if(typeof r[i]=="number")return l?n.find(d=>d.value===r[i]).value:r[i]})(),p=this.propReferences.push(r[i])-1,a=!0}else(i!=null&&r==null||i==null&&r==null)&&console.warn('[GUI] list() "obj" and "prop" parameters must be used together.');this.imageContainer=null;let f=document.createElement("div");f.className="p-gui__list",f.textContent=o,this.wrapper.append(f);let c=document.createElement("select");f.append(c),c.className="p-gui__list-dropdown",c.addEventListener("change",d=>{a?r[i]=d.target.value:t&&t(d.target.value),this.onUpdate&&this.onUpdate()}),n&&n.forEach((d,h)=>{const g=l?d.name:d,u=l?d.value:d;let m=document.createElement("option");m.setAttribute("value",u),m.textContent=g,c.append(m),(!l&&s==h||l&&s==u)&&m.setAttribute("selected","")}),a&&Object.defineProperty(r,i,{set:d=>{let h,g,u;l?(u=n.find(v=>v.value==d),g=(u==null?void 0:u.value)||n[0].value,h=n.indexOf(u)):(typeof d=="string"&&(h=n.indexOf(d),g=d),typeof d=="number"&&(h=d,g=n[d])),this.propReferences[p]=l?g:d;const m=c.querySelector("[selected]");m&&m.removeAttribute("selected"),c.querySelectorAll("option")[h].setAttribute("selected",""),typeof t=="function"&&t(l?u:g,h)},get:()=>this.propReferences[p]})}vector2(e={},t){if(typeof e!="object")throw Error(`[GUI] vector2() first parameter must be an object. Received: ${typeof e}.`);let o=typeof e.name=="string"&&e.name||" ";const a=e.x.min??0,p=e.x.max??1,r=e.y.min??0,i=e.y.max??1,n=e.x.obj,s=e.x.prop,l=this.propReferences.push(n[s])-1,f=e.y.obj,c=e.y.prop,d=this.propReferences.push(f[c])-1;t=typeof t=="function"?t:null,this.imageContainer=null;const h=document.createElement("div");h.className="p-gui__vector2",h.textContent=o,this.wrapper.append(h);const g=document.createElement("div");g.className="p-gui__vector-value",g.textContent=n[s]+", "+f[c],h.append(g);const u=document.createElement("div");u.className="p-gui__vector2-area",h.append(u),u.addEventListener("click",b=>{n[s]=parseFloat(this._mapLinear(b.offsetX,0,u.clientWidth,a,p).toFixed(2)),f[c]=parseFloat(this._mapLinear(b.offsetY,0,u.clientHeight,i,r).toFixed(2)),t&&t(n[s],n[c]),this.onUpdate&&this.onUpdate()});let m=!1;u.addEventListener("pointerdown",b=>{m=!0}),u.addEventListener("pointerup",()=>{m=!1}),u.addEventListener("pointermove",b=>{m&&(n[s]=parseFloat(this._mapLinear(b.offsetX,0,u.clientWidth,a,p).toFixed(2)),f[c]=parseFloat(this._mapLinear(b.offsetY,0,u.clientHeight,i,r).toFixed(2)),t&&t(n[s],n[c])),this.onUpdate&&this.onUpdate()});const v=document.createElement("div");v.className="p-gui__vector2-line p-gui__vector2-line-x",u.append(v);const y=document.createElement("div");y.className="p-gui__vector2-line p-gui__vector2-line-y",u.append(y);const _=document.createElement("div");_.className="p-gui__vector2-dot",u.append(_),_.style.left=this._mapLinear(n[s],a,p,0,u.clientWidth)+"px",_.style.top=this._mapLinear(f[c],r,i,u.clientHeight,0)+"px",Object.defineProperty(n,s,{set:b=>{this.propReferences[l]=b,_.style.left=this._mapLinear(b,a,p,0,u.clientWidth)+"px",g.textContent=String(b)+", "+f[c]},get:()=>this.propReferences[l]}),Object.defineProperty(f,c,{set:b=>{this.propReferences[d]=b,_.style.top=this._mapLinear(b,r,i,u.clientHeight,0)+"px",g.textContent=n[s]+", "+String(b)},get:()=>this.propReferences[d]})}color(e={},t){if(typeof e!="object")throw Error(`[GUI] color() first parameter must be an object. Received: ${typeof e}.`);let o=typeof e.name=="string"&&e.name||" ",a=!1,p=null,r=e.obj,i=e.prop,n;if(typeof e.value=="string"&&(e.value.length!=7||e.value[0]!="#"?console.error(`[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${e.value}".`):n=e.value),n||(n="#000000"),e.value!==void 0)(i!=null||r!=null)&&console.warn('[GUI] color() "obj" and "prop" parameters are ignored when a "value" parameter is used.');else if(i!=null&&r!=null){if(typeof i!="string")throw Error(`[GUI] color() "prop" parameter must be an string. Received: ${typeof i}.`);if(typeof r!="object")throw Error(`[GUI] color() "obj" parameter must be an object. Received: ${typeof r}.`);o==" "&&(o=i),p=this.propReferences.push(r[i])-1,a=!0}else(i!=null&&r==null||i==null&&r==null)&&console.warn('[GUI] color() "obj" and "prop" parameters must be used together.');this.imageContainer=null;const s=document.createElement("div");s.className="p-gui__color",s.textContent=o,this.wrapper.append(s);const l=document.createElement("input");l.className="p-gui__color-picker",l.setAttribute("type","color"),l.value=n,s.append(l),typeof t=="function"&&l.addEventListener("input",()=>{a?r[i]=l.value:typeof t=="function"&&t(l.value),this.onUpdate&&this.onUpdate()}),a&&Object.defineProperty(r,i,{set:f=>{this.propReferences[p]=f,l.value=f,typeof t=="function"&&t(f)},get:()=>this.propReferences[p]})}folder(e={}){let t=typeof e.closed=="boolean"?e.closed:!1,o=e.name||"",a=e.color||null,p=e.maxHeight||null;this.imageContainer=null;let r="p-gui__folder";this.folders.length==0&&(r+=" p-gui__folder--first"),t&&(r+=" p-gui__folder--closed");let i=a?`background-color: ${a};`:"";i+=p?`max-height: ${p}px;`:"";const n=document.createElement("div");n.className=r,n.style=i,this.wrapper.append(n);const s=document.createElement("div");s.innerHTML=`<span class="p-gui__folder-arrow"></span>${o}`,s.className="p-gui__folder-header",n.append(s),s.addEventListener("click",()=>{n.classList.toggle("p-gui__folder--closed")});let l=new x({isFolder:!0,folderOptions:{wrapper:n,parent:this}});return this.folders.push(l),l}_makeDraggable(){var e=this;this.header.addEventListener("pointerdown",t),this.header.addEventListener("pointerup",a);function t(p){p.preventDefault(),e.position.initX=e.position.x,e.position.initY=e.position.y,e.position.prevX=p.clientX,e.position.prevY=p.clientY,document.addEventListener("pointermove",o)}function o(p){p.preventDefault(),e.hasBeenDragged||(e.hasBeenDragged=!0,e.wrapper.setAttribute("data-dragged","true")),e.position.x=e.position.initX+p.clientX-e.position.prevX,e.position.y=e.position.initY+p.clientY-e.position.prevY,e.wrapper.style.transform="translate3d("+e.position.x+"px,"+e.position.y+"px,0)"}function a(p){document.removeEventListener("pointermove",o)}}toggleClose(){this.closed=!this.closed,this.wrapper.classList.toggle("p-gui--collapsed")}kill(){this.wrapper.remove()}_mapLinear(e,t,o,a,p){return a+(e-t)*(p-a)/(o-t)}}return x});
