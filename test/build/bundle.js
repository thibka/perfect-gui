(()=>{"use strict";class e{constructor(t={}){if(t.container?(this.container="string"==typeof t.container?document.querySelector(t.container):t.container,this.position_type="absolute"):(this.container=document.body,this.position_type="fixed"),t.isFolder)return void this._folderConstructor(t.folderOptions);if(this.name=null!=t&&"string"==typeof t.name?t.name:"",this instanceof e&&("number"!=typeof e[e.instanceCounter]?e[e.instanceCounter]=0:e[e.instanceCounter]++),this.instanceId=e[e.instanceCounter],this.wrapperWidth=null!=t&&t.width?t.width:290,this.stylesheet=document.createElement("style"),this.stylesheet.setAttribute("type","text/css"),this.stylesheet.setAttribute("id","lm-gui-stylesheet"),document.head.append(this.stylesheet),0==this.instanceId&&this._addStyles(`\n.p-gui {\n    position: ${this.position_type};\n    top: 0;\n    left: 0;\n    transform: translate3d(0,0,0);\n    padding: 20px 0px 4px 0px;\n    background: #2e2e2e;\n    display: flex;\n    justify-content: center;\n    flex-wrap: wrap;\n    font-family: Verdana, Arial, sans-serif;\n    width: 290px;\n    overflow: hidden;\n    box-shadow: 0 0 10px black;\n    box-sizing: border-box;\n    z-index: 99999;\n    user-select: none;\n}\n\n.p-gui--collapsed {\n    height: 0;\n    padding: 21px 10px 0 10px;\n}\n\n.p-gui__header {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 20px;\n    background-color: #111111;\n    border-bottom: 1px solid #484848;\n    cursor: grab;\n    color: grey;\n    font-size: 10px;\n    line-height: 20px;\n    padding-left: 8px;\n    box-sizing: border-box;\n}\n\n.p-gui__header-close {\n    width: 20px;\n    height: 20px;\n    position: absolute;\n    top: 0;\n    right: 0;\n    cursor: pointer;\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAABFJREFUCNdjIAb8//8BjIkAAOrOBd3TR0jRAAAAAElFTkSuQmCC);\n    background-size: 50% 50%;\n    background-position: center;\n    background-repeat: no-repeat; \n}\n\n.p-gui--collapsed .p-gui__header-close {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAABVJREFUCNdjYEhgIIj///8AwsSoBQD43QydY5mb0QAAAABJRU5ErkJggg==);\n}\n\n.p-gui__image-container {\n    width: 100%;\n    padding: 0 10px;\n    display: flex;\n    flex-wrap: wrap;\n    margin-bottom: 5px;\n}\n\n.p-gui__image {\n    width: 30.33%;\n    height: 80px;\n    background-size: cover;\n    margin: 5px 1.5% 17px 1.5%;\n    cursor: pointer;\n    position: relative;\n}\n\n.p-gui__image-text {\n    position: absolute;\n    bottom: -15px;\n    color: #eee;\n    font-size: 11px;\n    text-shadow: 0 -1px 0 #111;\n}\n\n.p-gui__button, \n.p-gui__switch,\n.p-gui__list {\n    width: 100%;\n    margin: 3px;\n    padding: 7px;\n    background: #1b1b1b;\n    font-size: 11px;\n    color: white;\n    border-bottom: 1px solid #00ff89;\n    cursor: pointer;\n    position: relative;\n    box-sizing: border-box;\n}\n\n.p-gui__list {\n    cursor: default;\n}\n\n.p-gui__button:hover,\n.p-gui__switch:hover {\n    background: #101010;\n}\n\n.p-gui__switch-checkbox {\n    width: 5px;\n    height: 5px;\n    background-color: #343434;\n    position: absolute;\n    top: 0;\n    right: 8px;\n    bottom: 0;\n    margin: auto;\n    border-radius: 50%;\n    pointer-events: none;\n}\n\n.p-gui__switch-checkbox--active {\n    background-color: #00ff89;\n    box-shadow: 0 0 5px #00ff89;\n}\n\n.p-gui__list-dropdown {\n    position: absolute;\n    right: 5px;\n    top: 0;\n    bottom: 0;\n    margin: auto;\n    height: 18px;\n    cursor: pointer;\n}\n\n.p-gui__slider {\n    width: 100%;\n    margin: 3px 3px 9px 3px;\n    padding: 7px;\n    background: #1b1b1b;\n    font-size: 11px;\n    color: white;\n    position: relative;\n}\n\n.p-gui__slider-ctrl {\n    -webkit-appearance: none;\n    padding: 0;\n    font: inherit;\n    outline: none;\n    opacity: .8;\n    background: #00a1ff;\n    box-sizing: border-box;\n    cursor: pointer;\n    position: absolute;\n    bottom: -5px;\n    right: 0;\n    height: 5px;\n    width: 100%;\n    margin: 0;\n}\n\n/* la zone de déplacement */\n.p-gui__slider-ctrl::-webkit-slider-runnable-track {\n    height: 12px;\n    border: none;\n    border-radius: 0;\n    background-color: transparent;  /* supprimé définie sur l'input */\n}\n\n/* le curseur */\n.p-gui__slider-ctrl::-webkit-slider-thumb {\n    -webkit-appearance: none;       /* également nécessaire sur le curseur */\n    width: 12px;\n    height: inherit;                /* s'adapte à la hauteur de l'input */\n    border: none;\n    border-radius: 50%;               /* pris en compte sur Webkit et Edge */\n    background: white;       /* pris en compte sur Webkit only */\n    border: 2px solid #00a1ff;\n}\n\n.p-gui__slider-value {\n    display: inline-block;\n    position: absolute;\n    right: 7px;\n}\n\n.p-gui__folder {\n    width: 100%;\n    position: relative;\n    background: #434343;\n    overflow: hidden;\n    margin-bottom: 3px;\n    padding-bottom: 1px;\n    display: flex;\n    flex-wrap: wrap;\n    border-left: 2px solid grey;\n    margin-top: 5px;\n}\n\n.p-gui__folder--first {\n    margin-top: 0;\n}\n\n.p-gui__folder--closed {\n    height: 22px;\n}\n\n.p-gui__folder-header {\n    padding: 5px;\n    font-size: 11px;\n    background-color: #222222;\n    color: white;\n    cursor: pointer;\n    width: 100%;\n}\n\n.p-gui__folder-header:hover {\n    background-color: #111111;\n}\n\n.p-gui__folder-arrow {\n    width: 8px;\n    height: 8px;\n    display: inline-block;\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAHlBMVEUAAAD///////////////////////////////////8kfJuVAAAACXRSTlMA9Z1fCdMo1yxEJnA0AAAAK0lEQVQI12PABlRgjKkJUMZMYRhjpgqMAZSEMICSaIzpDWiKhdENhEhgAgATSg5jyWnYewAAAABJRU5ErkJggg==);\n    background-size: contain;\n    margin-right: 5px;\n    transform: rotate(90deg)\n}\n\n.p-gui__folder--closed .p-gui__folder-arrow {\n    transform: rotate(0deg);\n}\n\n.p-gui__folder .p-gui__button, \n.p-gui__folder .p-gui__switch,\n.p-gui__folder .p-gui__slider,\n.p-gui__folder .p-gui__list {\n    margin-left: 6px;\n}\n`),this.screenCorner=this._parseScreenCorner(t.position),this.xOffset="left"==this.screenCorner.x?0:this.container.clientWidth-this.wrapperWidth,this.instanceId>0){let e=this.container.querySelectorAll(".p-gui");for(let t=0;t<e.length;t++)this.screenCorner.y==e[t].dataset.cornerY&&("left"==this.screenCorner.x&&"left"==e[t].dataset.cornerX?this.xOffset+=e[t].offsetWidth:"right"==this.screenCorner.x&&"right"==e[t].dataset.cornerX&&(this.xOffset-=e[t].offsetWidth))}this.yOffset=0,this.position={prevX:this.xOffset,prevY:this.yOffset,x:this.xOffset,y:this.yOffset};let n="top"==this.screenCorner.y?"":"top: auto; bottom: 0;";this._addStyles(`#p-gui-${this.instanceId} {\n            width: ${this.wrapperWidth}px;\n            transform: translate3d(${this.xOffset}px,${this.yOffset}px,0);\n            ${n}\n        }`),0!=t.autoRepositioning&&window.addEventListener("resize",this._handleResize.bind(this)),this._addWrapper(),this.wrapper.setAttribute("data-corner-x",this.screenCorner.x),this.wrapper.setAttribute("data-corner-y",this.screenCorner.y),this.hasBeenDragged=!1,1==t.draggable&&this._makeDraggable(),this.closed=!1,t.closed&&this.toggleClose(),this.folders=[]}_folderConstructor(e){this.wrapper=e.wrapper}_parseScreenCorner(e){let t={x:"left",y:"top"};return null==e||("string"!=typeof e&&console.error("[perfect-gui] The position option must be a string."),e.includes("right")&&(t.x="right"),e.includes("bottom")&&(t.y="bottom")),t}_handleResize(){if(!this.hasBeenDragged){if(this.xOffset="left"==this.screenCorner.x?0:this.container.clientWidth-this.wrapperWidth,this.instanceId>0){let e=this.container.querySelectorAll(`.p-gui:not(#${this.wrapper.id}):not([data-dragged])`);for(let t=0;t<e.length&&!(parseInt(e[t].id.replace("p-gui-",""))>this.instanceId);t++)this.screenCorner.y==e[t].dataset.cornerY&&("left"==this.screenCorner.x&&"left"==e[t].dataset.cornerX?this.xOffset+=e[t].offsetWidth:"right"==this.screenCorner.x&&"right"==e[t].dataset.cornerX&&(this.xOffset-=e[t].offsetWidth))}this.position={prevX:this.xOffset,prevY:this.yOffset,x:this.xOffset,y:this.yOffset},this.wrapper.style.transform=`translate3d(${this.position.x}px, ${this.position.y}px, 0)`}}_createElement(e){e.el=e.el?e.el:"div";var t=document.createElement(e.el);if(e.id&&(t.id=e.id),e.class&&(t.className=e.class),e.inline&&(t.style=e.inline),e.href&&(t.href=e.href),e.onclick&&(t.onclick=e.onclick),e.onchange&&(t.onchange=e.onchange),e.textContent&&(t.textContent=e.textContent),e.innerHTML&&(t.innerHTML=e.innerHTML),e.customAttributes)for(var n in e.customAttributes)t.setAttribute(n,e.customAttributes[n]);return e.parent=e.parent?e.parent:this.wrapper,e.parent.append(t),t}_addStyles(e){this.stylesheet.innerHTML+=e}_addWrapper(){this.wrapper=this._createElement({parent:this.container,id:"p-gui-"+this.instanceId,class:"p-gui"}),this.header=this._createElement({parent:this.wrapper,class:"p-gui__header",textContent:this.name}),this._createElement({parent:this.header,class:"p-gui__header-close",onclick:this.toggleClose.bind(this)})}addButton(e,t){let n={text:e,callback:t};this._checkMandatoryParams({text:"string",callback:"function"},n),this.imageContainer=null,this._createElement({class:"p-gui__button",onclick:n.callback,textContent:n.text})}addImage(e,t,n){let i={text:e,path:t,callback:n};this._checkMandatoryParams({text:"string",path:"string",callback:"function"},i),this.imageContainer||(this.imageContainer=this._createElement({class:"p-gui__image-container"}));var o=this._createElement({class:"p-gui__image",onclick:()=>i.callback(i.path),inline:`background-image: url(${i.path})`,parent:this.imageContainer});this._createElement({parent:o,class:"p-gui__image-text",textContent:i.text})}addSlider(e,t,n){this._checkMandatoryParams({min:"number",max:"number",value:"number",step:"number"},t),this.imageContainer=null;var i=this._createElement({class:"p-gui__slider",textContent:e}),o=this._createElement({parent:i,el:"input",class:"p-gui__slider-ctrl",customAttributes:{type:"range",min:t.min,max:t.max,step:t.step,value:t.value}}),r=this._createElement({parent:i,class:"p-gui__slider-value",textContent:t.value});o.addEventListener("input",(function(){r.textContent=o.value,"function"==typeof n&&n(o.value)}))}addSwitch(e,t,n){let i={text:e,state:t,callback:n};this._checkMandatoryParams({text:"string",state:"boolean",callback:"function"},i),this.imageContainer=null;let o=this._createElement({class:"p-gui__switch",onclick:e=>{let t=e.target.childNodes[1],n=!0;t.classList.contains("p-gui__switch-checkbox--active")&&(n=!1),t.classList.toggle("p-gui__switch-checkbox--active"),i.callback(n)},textContent:i.text}),r=t?" p-gui__switch-checkbox--active":"";this._createElement({parent:o,class:"p-gui__switch-checkbox"+r})}addList(e,t,n){let i={text:e,list:t,callback:n};this._checkMandatoryParams({text:"string",list:"object",callback:"function"},i),this.imageContainer=null;let o=this._createElement({class:"p-gui__list",textContent:i.text}),r=this._createElement({parent:o,el:"select",class:"p-gui__list-dropdown",onchange:e=>{i.callback(e.target.value)}});t.forEach((e=>{this._createElement({parent:r,el:"option",customAttributes:{value:e},textContent:e})}))}addFolder(t,n={}){let i="boolean"==typeof n.closed&&n.closed,o={name:t,closed:i};this._checkMandatoryParams({name:"string",closed:"boolean"},o),this.imageContainer=null;let r="p-gui__folder";0==this.folders.length&&(r+=" p-gui__folder--first"),i&&(r+=" p-gui__folder--closed");let a=this._createElement({class:r}),s=(this._createElement({innerHTML:`<span class="p-gui__folder-arrow"></span>${o.name}`,class:"p-gui__folder-header",onclick:function(){this.parentNode.classList.toggle("p-gui__folder--closed")},parent:a}),new e({isFolder:!0,folderOptions:{wrapper:a}}));return this.folders.push(s),s}_checkMandatoryParams(e,t){var n=[];for(var i in e)typeof t[i]==e[i]||n.push(i);n.length>0&&n.forEach((e=>{throw Error(`[GUI] Missing '${e}' parameter`)}))}_makeDraggable(){var e=this;function t(t){t.preventDefault(),e.hasBeenDragged||(e.hasBeenDragged=!0,e.wrapper.setAttribute("data-dragged","true")),e.position.x=e.position.initX+t.clientX-e.position.prevX,e.position.y=e.position.initY+t.clientY-e.position.prevY,e.wrapper.style.transform="translate3d("+e.position.x+"px,"+e.position.y+"px,0)"}this.header.addEventListener("mousedown",(function(n){n.preventDefault(),e.position.initX=e.position.x,e.position.initY=e.position.y,e.position.prevX=n.clientX,e.position.prevY=n.clientY,document.addEventListener("mousemove",t)})),this.header.addEventListener("mouseup",(function(e){document.removeEventListener("mousemove",t)}))}toggleClose(){this.closed=!this.closed,this.wrapper.classList.toggle("p-gui--collapsed")}}function t(){for(var e="0123456789ABCDEF".split(""),t="#",n=0;n<6;n++)t+=e[Math.round(15*Math.random())];return t}!function(){const n=document.querySelector("#container-1 .element"),i=new e({name:"Basics",container:"#container-1"});i.addButton("Button",(()=>{n.style.backgroundColor=t(),n.style.backgroundImage="none"})),i.addSlider("Slider",{min:0,max:2,value:1,step:.01},(e=>n.style.transform=`scale(${e})`)),i.addSwitch("Switch",!0,(e=>{e?n.classList.remove("round"):n.classList.add("round")})),i.addList("List",["red","pink","yellow","blue"],(e=>{n.style.backgroundColor=e,n.style.backgroundImage="none"})),i.addImage("Image 1","https://images.unsplash.com/photo-1485254767195-60704c46702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=512&q=80",(e=>{n.style.backgroundImage=`url(${e})`,document.querySelector("#container-1 .note").textContent="Photo by Joel Filipe on Unsplash"})),i.addImage("Image 2","https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=512&q=80",(e=>{n.style.backgroundImage=`url(${e})`,document.querySelector("#container-1 .note").textContent="Photo by Milad Fakurian on Unsplash"}))}(),function(){const n=document.querySelector("#container-2 .element");new e({name:"GUI 1",width:200,container:"#container-2"}).addButton("By the way, buttons can handle multiple lines of text.",(()=>{n.style.backgroundColor=t()})),new e({name:"GUI 2",width:200,container:"#container-2"}).addButton("Button",(()=>n.style.backgroundColor=t())),new e({name:"GUI 3",position:"top right",container:"#container-2"}).addButton("Button",(()=>n.style.backgroundColor=t())),new e({name:"GUI 4",position:"right bottom",container:"#container-2"}).addButton("Button",(()=>n.style.backgroundColor=t()))}(),function(){const n=document.querySelector("#container-3 .element"),i=new e({name:"Folders",container:"#container-3"});i.addFolder("Folder 1 (open)").addButton("Random color",(()=>{n.style.backgroundColor=t()})),i.addFolder("Folder 2 (closed)",{closed:!0}).addButton("Random color",(()=>{n.style.backgroundColor=t()}))}(),function(){const t=new e({container:"#container-4",name:"GUI 1 (drag me!)",width:500,draggable:!0});t.addButton("Custom width using the `width` option",(()=>{}));const n=new e({container:"#container-4",name:"GUI 2 (drag me!)",close:!0,draggable:!0,position:"bottom left"});n.addButton("gui_1.toggleClose();",(()=>{t.toggleClose()})),new e({container:"#container-4",name:"GUI 3 (closed)",closed:!0}).addButton("gui_2.toggleClose();",(()=>{n.toggleClose()}))}()})();