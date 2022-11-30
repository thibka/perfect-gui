/**
 * JS instead of CSS to avoid
 * depending on a css loader
 */

export default function( position_type ) {
return /* css */`
.p-gui {
    position: ${ position_type };
    top: 0;
    left: 0;
    transform: translate3d(0,0,0);
    padding-top: 21px;
    background: #2e2e2e;
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
    border-bottom: 1px solid #484848;
    cursor: grab;
    color: grey;
    font-size: 10px;
    line-height: 20px;
    padding-left: 8px;
    box-sizing: border-box;
    touch-action: none;
}

.p-gui__header-close {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    right: 0;
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
    font-size: 11px;
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
    padding: 7px;
    font-size: 11px;
    color: white;
    border-bottom: 1px solid #00ff89;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
    margin-bottom: 3px;
}

.p-gui__button,
.p-gui__switch {
    margin-right: 2px;
    margin-left: 2px;
    border: 1px solid rgba(0,0,0,.5);
    border-bottom: 1px solid #00ff89;
    border-radius: 2px;
    background: rgba(0, 0, 0, .3);
    background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 5%, rgba(0,0,0,0) 95%, rgba(0,0,0,0.3) 100%);
}

.p-gui__button:hover,
.p-gui__switch:hover {
    background: rgba(0, 0, 0, .3);
}

.p-gui__folder .p-gui__button,
.p-gui__folder .p-gui__switch {
    margin-right: 0;
    margin-left: 0;
}

.p-gui__vector2 {
    background: transparent;
    border-bottom: 1px solid #ff9999;
    aspect-ratio: 1;
    padding-bottom: 0;
}

.p-gui__vector2-area {
    position: relative;
    background: rgba(0, 0, 0, .3);
    margin-top: 8px;
    width: 100%;
    height: calc(100% - 28px);
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
    position: absolute;
    top: 0;
    right: 8px;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    pointer-events: none;
}

.p-gui__switch-checkbox--active {
    background-color: #00ff89;
    box-shadow: 0 0 5px #00ff89;
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
}

.p-gui__list-dropdown {
    background: rgba(0,0,0,.25);
    color: white;
    border: 1px solid rgba(0,0,0,.5);
    border-radius: 3px;
    padding: 0 12px;
    top: -1px;
}

.p-gui__color-picker {
    -webkit-appearance: none;
    padding: 0;
    background-color: transparent;
    border: 1px solid #222222;
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
    font-size: 11px;
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
    background: #00a1ff;
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
    overflow: hidden;
    margin-bottom: 3px;
    display: flex;
    flex-wrap: wrap;
    border-left: 2px solid grey;
    padding: 0 3px;
}

.p-gui__folder--first {
    margin-top: 0;
}

.p-gui__folder--closed {
    height: 22px;
}

.p-gui__folder-header {
    padding: 5px;
    font-size: 11px;
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
};