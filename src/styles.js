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
    padding: 20px 0px 4px 0px;
    background: #2e2e2e;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    font-family: Verdana, Arial, sans-serif;
    width: 290px;
    overflow: hidden;
    box-shadow: 0 0 10px black;
    box-sizing: border-box;
    z-index: 99999;
    user-select: none;
}

.p-gui--collapsed {
    height: 0;
    padding: 21px 10px 0 10px;
}

.p-gui__header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background-color: #111111;
    border-bottom: 1px solid #484848;
    cursor: grab;
    color: grey;
    font-size: 10px;
    line-height: 20px;
    padding-left: 8px;
    box-sizing: border-box;
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
    padding: 0 10px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5px;
}

.p-gui__image {
    width: 30.33%;
    height: 80px;
    background-size: cover;
    margin: 5px 1.5% 17px 1.5%;
    cursor: pointer;
    position: relative;
}

.p-gui__image-text {
    position: absolute;
    bottom: -15px;
    color: #eee;
    font-size: 11px;
    text-shadow: 0 -1px 0 #111;
}

.p-gui__button, 
.p-gui__switch,
.p-gui__list,
.p-gui__vector2 {
    width: 100%;
    margin: 3px;
    padding: 7px;
    background: #1b1b1b;
    font-size: 11px;
    color: white;
    border-bottom: 1px solid #00ff89;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
}

.p-gui__vector2 {
    border-bottom: 1px solid #ff9999;
    aspect-ratio: 1;
}

.p-gui__vector2-area {
    position: relative;
    background: black;
    margin-top: 11px;
    width: 100%;
    height: calc(100% - 33px);
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

.p-gui__list {
    cursor: default;
}

.p-gui__button:hover,
.p-gui__switch:hover {
    background: #101010;
}

.p-gui__switch-checkbox {
    width: 5px;
    height: 5px;
    background-color: #343434;
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

.p-gui__list-dropdown {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 18px;
    cursor: pointer;
}

.p-gui__slider {
    width: 100%;
    margin: 3px 3px 9px 3px;
    padding: 7px;
    background: #1b1b1b;
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
    bottom: -5px;
    right: 0;
    height: 5px;
    width: 100%;
    margin: 0;
}

/* la zone de déplacement */
.p-gui__slider-ctrl::-webkit-slider-runnable-track {
    height: 12px;
    border: none;
    border-radius: 0;
    background-color: transparent;  /* supprimé définie sur l'input */
}

/* le curseur */
.p-gui__slider-ctrl::-webkit-slider-thumb {
    -webkit-appearance: none;       /* également nécessaire sur le curseur */
    width: 12px;
    height: inherit;                /* s'adapte à la hauteur de l'input */
    border: none;
    border-radius: 50%;               /* pris en compte sur Webkit et Edge */
    background: white;       /* pris en compte sur Webkit only */
    border: 2px solid #00a1ff;
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
    padding-bottom: 1px;
    display: flex;
    flex-wrap: wrap;
    border-left: 2px solid grey;
    margin-top: 5px;
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
    background-color: #222222;
    color: white;
    cursor: pointer;
    width: 100%;
}

.p-gui__folder-header:hover {
    background-color: #111111;
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

.p-gui__folder .p-gui__button, 
.p-gui__folder .p-gui__switch,
.p-gui__folder .p-gui__slider,
.p-gui__folder .p-gui__list {
    margin-left: 6px;
}
`
};