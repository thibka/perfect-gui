(function(_,g){typeof exports=="object"&&typeof module<"u"?module.exports=g():typeof define=="function"&&define.amd?define(g):(_=typeof globalThis<"u"?globalThis:_||self,_["Perfect GUI"]=g())})(this,function(){"use strict";function _(A){return`
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
    `}class g{constructor(e={}){if(e.container?(this.container=typeof e.container=="string"?document.querySelector(e.container):e.container,this.position_type="absolute"):(this.container=document.body,this.position_type="fixed"),this.propReferences=[],this.folders=[],e.isFolder){this._folderConstructor(e.folderOptions);return}this.name=e!=null&&typeof e.name=="string"?e.name:"",this.backgroundColor=e.color||null,this.container==document.body?this.maxHeight=window.innerHeight:this.maxHeight=Math.min(this.container.clientHeight,window.innerHeight),e.maxHeight&&(this.initMaxHeight=e.maxHeight,this.maxHeight=Math.min(this.initMaxHeight,this.maxHeight)),this.screenCorner=this._parseScreenCorner(e.position),this instanceof g&&(typeof g[g.instanceCounter]!="number"?g[g.instanceCounter]=0:g[g.instanceCounter]++),this.instanceId=g[g.instanceCounter],this.wrapperWidth=e.width||290,this.stylesheet=document.createElement("style"),this.stylesheet.setAttribute("type","text/css"),this.stylesheet.setAttribute("id","lm-gui-stylesheet"),document.head.append(this.stylesheet),this.instanceId==0&&this._addStyles(`${_(this.position_type)}`),this._styleInstance(),this._addWrapper(),this.wrapper.setAttribute("data-corner-x",this.screenCorner.x),this.wrapper.setAttribute("data-corner-y",this.screenCorner.y),e.autoRepositioning!=!1&&window.addEventListener("resize",this._handleResize.bind(this)),this._handleResize(),this.hasBeenDragged=!1,e.draggable==!0&&this._makeDraggable(),this.closed=!1,e.closed&&this.toggleClose()}_styleInstance(){let e=this._getScrollbarWidth(this.container);if(this.screenCorner.x=="left"?this.xOffset=0:this.xOffset=this.container.clientWidth-this.wrapperWidth-e,this.instanceId>0){let t=this.container.querySelectorAll(".p-gui");for(let o=0;o<t.length;o++)this.screenCorner.y==t[o].dataset.cornerY&&(this.screenCorner.x=="left"&&t[o].dataset.cornerX=="left"?this.xOffset+=t[o].offsetWidth:this.screenCorner.x=="right"&&t[o].dataset.cornerX=="right"&&(this.xOffset-=t[o].offsetWidth))}this.yOffset=0,this.position={prevX:this.xOffset,prevY:this.yOffset,x:this.xOffset,y:this.yOffset},this._addStyles(`#p-gui-${this.instanceId} {
            width: ${this.wrapperWidth}px;
            max-height: ${this.maxHeight}px;
            transform: translate3d(${this.xOffset}px,${this.yOffset}px,0);
            ${this.screenCorner.y=="top"?"":"top: auto; bottom: 0;"}
            ${this.backgroundColor?"background: "+this.backgroundColor+";":""}
        }`)}_folderConstructor(e){this.wrapper=e.wrapper}_parseScreenCorner(e){let t={x:"right",y:"top"};return e==null||(typeof e!="string"&&console.error("[perfect-gui] Position must be a string."),e.includes("left")&&(t.x="left"),e.includes("bottom")&&(t.y="bottom")),t}_getScrollbarWidth(e){return e===document.body?window.innerWidth-document.documentElement.clientWidth:e.offsetWidth-e.clientWidth}_handleResize(){if(this.container==document.body?this.maxHeight=window.innerHeight:this.maxHeight=Math.min(this.container.clientHeight,window.innerHeight),this.initMaxHeight&&(this.maxHeight=Math.min(this.initMaxHeight,this.maxHeight)),this.wrapper.style.maxHeight=this.maxHeight+"px",this.hasBeenDragged)return;let e=this._getScrollbarWidth(this.container);if(this.xOffset=this.screenCorner.x=="left"?0:this.container.clientWidth-this.wrapperWidth-e,this.instanceId>0){let t=this.container.querySelectorAll(`.p-gui:not(#${this.wrapper.id}):not([data-dragged])`);for(let o=0;o<t.length&&!(parseInt(t[o].id.replace("p-gui-",""))>this.instanceId);o++)this.screenCorner.y==t[o].dataset.cornerY&&(this.screenCorner.x=="left"&&t[o].dataset.cornerX=="left"?this.xOffset+=t[o].offsetWidth:this.screenCorner.x=="right"&&t[o].dataset.cornerX=="right"&&(this.xOffset-=t[o].offsetWidth))}this.position={prevX:this.xOffset,prevY:this.yOffset,x:this.xOffset,y:this.yOffset},this.wrapper.style.transform=`translate3d(${this.position.x}px, ${this.position.y}px, 0)`}_addStyles(e){this.stylesheet.innerHTML+=e}_addWrapper(){this.wrapper=document.createElement("div"),this.wrapper.id="p-gui-"+this.instanceId,this.wrapper.className="p-gui",this.container.append(this.wrapper),this.header=document.createElement("div"),this.header.className="p-gui__header",this.header.textContent=this.name,this.header.style=`${this.backgroundColor?"border-color: "+this.backgroundColor+";":""}`,this.wrapper.append(this.header);const e=document.createElement("div");e.className="p-gui__header-close",e.addEventListener("click",this.toggleClose.bind(this)),this.header.append(e)}button(e,t){let o="";typeof e!="string"?typeof e=="object"&&(e!=null&&e.hasOwnProperty("name"))?o=e.name==""?" ":e.name:o=" ":o=e==""?" ":e,this.imageContainer=null,typeof t!="function"&&(t=()=>{});const a=document.createElement("div");a.className="p-gui__button",a.textContent=o,a.addEventListener("click",t),this.wrapper.append(a),typeof e.color=="string"&&(a.style.setProperty("--color-accent",e.color),a.style.setProperty("--color-accent-hover",e.hoverColor||e.color))}image(e={},t){if(typeof e!="object")throw Error(`[GUI] image() first parameter must be an object. Received: ${typeof e}.`);let o;if(typeof e.path=="string")o=e.path;else throw typeof e.path==null?Error("[GUI] image() path must be provided."):Error("[GUI] image() path must be a string.");let a=o.replace(/^.*[\\\/]/,""),d;e.name==null?d=a:d=typeof e.name=="string"&&e.name||" ";const r=e.selected===!0,i=e.selectionBorder!==!1;let s="";e.width&&(typeof e.width=="number"&&(e.width+="px"),s+=`flex: 0 0 calc(${e.width} - 5px); `),e.height&&(typeof e.height=="number"&&(e.height+="px"),s+=`height: ${e.height}; `),this.imageContainer||(this.imageContainer=document.createElement("div"),this.imageContainer.className="p-gui__image-container",this.wrapper.append(this.imageContainer));const n=document.createElement("div");n.className="p-gui__image",n.style="background-image: url("+o+"); "+s,this.imageContainer.append(n),r&&i&&n.classList.add("p-gui__image--selected");const l=document.createElement("div");return l.className="p-gui__image-text",l.textContent=d,n.append(l),n.addEventListener("click",()=>{let c=n.parentElement.querySelectorAll(".p-gui__image--selected");for(let p=0;p<c.length;p++)c[p].classList.remove("p-gui__image--selected");i&&n.classList.add("p-gui__image--selected"),typeof t=="function"&&t({path:o,text:d})}),n}slider(e={},t){if(typeof e!="object")throw Error(`[GUI] slider() first parameter must be an object. Received: ${typeof e}.`);let o=typeof e.name=="string"&&e.name||" ",a=!1,d=null,r=e.obj,i=e.prop,s=typeof e.value=="number"?e.value:null,n=e.min??0,l=e.max??1,c=e.step||(l-n)/100;if(s!==null)(i!=null||r!=null)&&console.warn('[GUI] slider() "obj" and "prop" parameters are ignored when a "value" parameter is used.');else if(i!=null&&r!=null){if(typeof i!="string")throw Error(`[GUI] slider() "prop" parameter must be an string. Received: ${typeof i}.`);if(typeof r!="object")throw Error(`[GUI] slider() "obj" parameter must be an object. Received: ${typeof r}.`);o==" "&&(o=i),d=this.propReferences.push(r[i])-1,a=!0}else(i!=null&&r==null||i==null&&r==null)&&console.warn('[GUI] slider() "obj" and "prop" parameters must be used together.'),s=(l-n)/2;this.imageContainer=null;const p=document.createElement("div");p.className="p-gui__slider",p.textContent=o,this.wrapper.append(p);const u=document.createElement("input");u.className="p-gui__slider-ctrl",u.setAttribute("type","range"),u.setAttribute("min",n),u.setAttribute("max",l),u.setAttribute("step",c),u.setAttribute("value",a?r[i]:s),p.append(u);const f=document.createElement("div");f.className="p-gui__slider-value",f.textContent=String(a?r[i]:s),p.append(f),u.addEventListener("input",()=>{f.textContent=u.value,a?r[i]=u.value:typeof t=="function"&&t(parseFloat(u.value))}),a&&Object.defineProperty(r,i,{set:m=>{this.propReferences[d]=m,u.value=m,f.textContent=String(m),typeof t=="function"&&t(parseFloat(u.value))},get:()=>this.propReferences[d]})}toggle(e={},t){if(typeof e!="object")throw Error(`[GUI] toggle() first parameter must be an object. Received: ${typeof e}.`);let o=typeof e.name=="string"&&e.name||" ",a=!1,d=null,r=e.obj,i=e.prop,s=typeof e.value=="boolean"?e.value:null;if(s!==null)(i!=null||r!=null)&&console.warn('[GUI] toggle() "obj" and "prop" parameters are ignored when a "value" parameter is used.');else if(i!=null&&r!=null){if(typeof i!="string")throw Error(`[GUI] toggle() "prop" parameter must be an string. Received: ${typeof i}.`);if(typeof r!="object")throw Error(`[GUI] toggle() "obj" parameter must be an object. Received: ${typeof r}.`);o==" "&&(o=i),d=this.propReferences.push(r[i])-1,a=!0}else(i!=null&&r==null||i==null&&r==null)&&console.warn('[GUI] toggle() "obj" and "prop" parameters must be used together.');this.imageContainer=null;const n=document.createElement("div");n.textContent=o,n.className="p-gui__switch",this.wrapper.append(n),n.addEventListener("click",p=>{const u=p.target.childNodes[1];let f=!0;u.classList.contains("p-gui__switch-checkbox--active")&&(f=!1),u.classList.toggle("p-gui__switch-checkbox--active"),a?r[i]=f:typeof t=="function"&&t(f)});let l=(()=>a?r[i]?" p-gui__switch-checkbox--active":"":s?" p-gui__switch-checkbox--active":"")();const c=document.createElement("div");c.className="p-gui__switch-checkbox"+l,n.append(c),a&&Object.defineProperty(r,i,{set:p=>{this.propReferences[d]=p,p?c.classList.add("p-gui__switch-checkbox--active"):c.classList.remove("p-gui__switch-checkbox--active"),typeof t=="function"&&t(p)},get:()=>this.propReferences[d]})}list(e={},t){if(typeof e!="object")throw Error(`[GUI] list() first parameter must be an object. Received: ${typeof e}.`);let o=typeof e.name=="string"?e.name:" ",a=!1,d=null,r=e.obj,i=e.prop,s=Array.isArray(e.values)?e.values:null,n;if(t=typeof t=="function"?t:null,e.value!==void 0||e.value===void 0&&r===void 0&&i===void 0)(i!=null||r!=null)&&console.warn('[GUI] list() "obj" and "prop" parameters are ignored when a "value" parameter is used.'),n=(()=>{if(!s)return null;if(typeof e.value=="string")return s.indexOf(e.value);if(typeof e.value=="number")return e.value})();else if(i!=null&&r!=null){if(typeof i!="string")throw Error(`[GUI] list() "prop" parameter must be an string. Received: ${typeof i}.`);if(typeof r!="object")throw Error(`[GUI] list() "obj" parameter must be an object. Received: ${typeof r}.`);n=(()=>{if(!s)return null;if(typeof r[i]=="string")return s.indexOf(r[i]);if(typeof r[i]=="number")return r[i]})(),d=this.propReferences.push(r[i])-1,a=!0}else(i!=null&&r==null||i==null&&r==null)&&console.warn('[GUI] list() "obj" and "prop" parameters must be used together.');this.imageContainer=null;let l=document.createElement("div");l.className="p-gui__list",l.textContent=o,this.wrapper.append(l);let c=document.createElement("select");l.append(c),c.className="p-gui__list-dropdown",c.addEventListener("change",p=>{a?r[i]=p.target.value:t&&t(p.target.value)}),s&&s.forEach((p,u)=>{let f=document.createElement("option");f.setAttribute("value",p),f.textContent=p,c.append(f),n==u&&f.setAttribute("selected","")}),a&&Object.defineProperty(r,i,{set:p=>{typeof p=="string"&&(n=s.indexOf(p)),typeof p=="number"&&(n=p),this.propReferences[d]=n,c.querySelector("[selected]").removeAttribute("selected"),c.querySelectorAll("option")[n].setAttribute("selected",""),typeof t=="function"&&t(n)},get:()=>this.propReferences[d]})}options(e,t){if(typeof e!="object")throw Error(`[GUI] options() first parameter must be an object. Received: ${typeof e}.`);this.list(e,t)}vector2(e={},t){if(typeof e!="object")throw Error(`[GUI] vector2() first parameter must be an object. Received: ${typeof e}.`);let o=typeof e.name=="string"&&e.name||" ";const a=e.x.min??0,d=e.x.max??1,r=e.y.min??0,i=e.y.max??1,s=e.x.obj,n=e.x.prop,l=this.propReferences.push(s[n])-1,c=e.y.obj,p=e.y.prop,u=this.propReferences.push(c[p])-1;t=typeof t=="function"?t:null,this.imageContainer=null;const f=document.createElement("div");f.className="p-gui__vector2",f.textContent=o,this.wrapper.append(f);const m=document.createElement("div");m.className="p-gui__vector-value",m.textContent=s[n]+", "+c[p],f.append(m);const h=document.createElement("div");h.className="p-gui__vector2-area",f.append(h),h.addEventListener("click",b=>{s[n]=parseFloat(this._mapLinear(b.offsetX,0,h.clientWidth,a,d).toFixed(2)),c[p]=parseFloat(this._mapLinear(b.offsetY,0,h.clientHeight,i,r).toFixed(2)),t&&t(s[n],s[p])});let w=!1;h.addEventListener("pointerdown",b=>{w=!0}),h.addEventListener("pointerup",()=>{w=!1}),h.addEventListener("pointermove",b=>{w&&(s[n]=parseFloat(this._mapLinear(b.offsetX,0,h.clientWidth,a,d).toFixed(2)),c[p]=parseFloat(this._mapLinear(b.offsetY,0,h.clientHeight,i,r).toFixed(2)),t&&t(s[n],s[p]))});const v=document.createElement("div");v.className="p-gui__vector2-line p-gui__vector2-line-x",h.append(v);const y=document.createElement("div");y.className="p-gui__vector2-line p-gui__vector2-line-y",h.append(y);const x=document.createElement("div");x.className="p-gui__vector2-dot",h.append(x),x.style.left=this._mapLinear(s[n],a,d,0,h.clientWidth)+"px",x.style.top=this._mapLinear(c[p],r,i,h.clientHeight,0)+"px",Object.defineProperty(s,n,{set:b=>{this.propReferences[l]=b,x.style.left=this._mapLinear(b,a,d,0,h.clientWidth)+"px",m.textContent=String(b)+", "+c[p]},get:()=>this.propReferences[l]}),Object.defineProperty(c,p,{set:b=>{this.propReferences[u]=b,x.style.top=this._mapLinear(b,r,i,h.clientHeight,0)+"px",m.textContent=s[n]+", "+String(b)},get:()=>this.propReferences[u]})}color(e={},t){if(typeof e!="object")throw Error(`[GUI] color() first parameter must be an object. Received: ${typeof e}.`);let o=typeof e.name=="string"&&e.name||" ",a=!1,d=null,r=e.obj,i=e.prop,s;if(typeof e.value=="string"&&(e.value.length!=7||e.value[0]!="#"?console.error(`[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${e.value}".`):s=e.value),s||(s="#000000"),e.value!==void 0)(i!=null||r!=null)&&console.warn('[GUI] color() "obj" and "prop" parameters are ignored when a "value" parameter is used.');else if(i!=null&&r!=null){if(typeof i!="string")throw Error(`[GUI] color() "prop" parameter must be an string. Received: ${typeof i}.`);if(typeof r!="object")throw Error(`[GUI] color() "obj" parameter must be an object. Received: ${typeof r}.`);o==" "&&(o=i),d=this.propReferences.push(r[i])-1,a=!0}else(i!=null&&r==null||i==null&&r==null)&&console.warn('[GUI] color() "obj" and "prop" parameters must be used together.');this.imageContainer=null;const n=document.createElement("div");n.className="p-gui__color",n.textContent=o,this.wrapper.append(n);const l=document.createElement("input");l.className="p-gui__color-picker",l.setAttribute("type","color"),l.value=s,n.append(l),typeof t=="function"&&l.addEventListener("input",()=>{a?r[i]=l.value:typeof t=="function"&&t(l.value)}),a&&Object.defineProperty(r,i,{set:c=>{this.propReferences[d]=c,l.value=c,typeof t=="function"&&t(c)},get:()=>this.propReferences[d]})}folder(e={}){let t=typeof e.closed=="boolean"?e.closed:!1,o=e.name||"",a=e.color||null,d=e.maxHeight||null;this.imageContainer=null;let r="p-gui__folder";this.folders.length==0&&(r+=" p-gui__folder--first"),t&&(r+=" p-gui__folder--closed");let i=a?`background-color: ${a};`:"";i+=d?`max-height: ${d}px;`:"";const s=document.createElement("div");s.className=r,s.style=i,this.wrapper.append(s);const n=document.createElement("div");n.innerHTML=`<span class="p-gui__folder-arrow"></span>${o}`,n.className="p-gui__folder-header",s.append(n),n.addEventListener("click",()=>{s.classList.toggle("p-gui__folder--closed")});let l=new g({isFolder:!0,folderOptions:{wrapper:s}});return this.folders.push(l),l}_makeDraggable(){var e=this;this.header.addEventListener("pointerdown",t),this.header.addEventListener("pointerup",a);function t(d){d.preventDefault(),e.position.initX=e.position.x,e.position.initY=e.position.y,e.position.prevX=d.clientX,e.position.prevY=d.clientY,document.addEventListener("pointermove",o)}function o(d){d.preventDefault(),e.hasBeenDragged||(e.hasBeenDragged=!0,e.wrapper.setAttribute("data-dragged","true")),e.position.x=e.position.initX+d.clientX-e.position.prevX,e.position.y=e.position.initY+d.clientY-e.position.prevY,e.wrapper.style.transform="translate3d("+e.position.x+"px,"+e.position.y+"px,0)"}function a(d){document.removeEventListener("pointermove",o)}}toggleClose(){this.closed=!this.closed,this.wrapper.classList.toggle("p-gui--collapsed")}kill(){this.wrapper.remove()}_mapLinear(e,t,o,a,d){return a+(e-t)*(d-a)/(o-t)}}return g});
