/**
 * JS instead of CSS to avoid
 * depending on a css loader
 */

export default `
.lm_gui {
    position: fixed;
    top: 0;
    left: 0;
    transform: translate3d(0,0,0);
    padding: 25px 10px 10px 10px;
    background: rgba(51,51,51,.9);
    display: flex;
    flex-wrap: wrap;
    font-family: Verdana, Arial, sans-serif;
    width: 290px;
    overflow: hidden;
    box-shadow: 0 0 10px black;
    box-sizing: border-box;
}

.lm_gui--collapsed {
    height: 0;
    padding: 21px 10px 0 10px;
}

.lm_gui__header {
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

.lm_gui__header-close {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    /*background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAGFBMVEUAAAD///////////////////////////8jfp1fAAAAB3RSTlMA2hq+JRu9E1zjOwAAAE1JREFUCNdjwAHcFEAkUwqQMBcCMRWLQUShAlBQHCgAIqF8MAXmQoTBghBhkCBUGCaIYCIUILQhDEO2AkqyAvkw5wSCnOMM1sFqgsMPAJjNDQhN21NVAAAAAElFTkSuQmCC);*/
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAABFJREFUCNdjIAb8//8BjIkAAOrOBd3TR0jRAAAAAElFTkSuQmCC);
    background-size: 50% 50%;
    background-position: center;
    background-repeat: no-repeat; 
}

.lm_gui--collapsed .lm_gui__header-close {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAABVJREFUCNdjYEhgIIj///8AwsSoBQD43QydY5mb0QAAAABJRU5ErkJggg==);
}

.lm_gui__item {
    width: 80px;
    height: 80px;
    background-size: cover;
    margin: 5px 5px 21px 5px;
    cursor: pointer;
    position: relative;
}

.lm_gui__item-text {
    position: absolute;
    bottom: -15px;
    color: #eee;
    font-size: 11px;
    text-shadow: 0 -1px 0 #111;
}

.lm_gui__button {
    width: 100%;
    margin: 5px;
    padding: 7px;
    background: #1b1b1b;
    font-size: 11px;
    color: white;
    border-bottom: 1px solid #00ff89;
    cursor: pointer;
    position: relative;
}

.lm_gui__button:hover {
    background: #101010;
}

.lm_gui__slider {
    width: 100%;
    margin: 5px 5px 10px 5px;
    padding: 7px;
    background: #1b1b1b;
    font-size: 11px;
    color: white;
    position: relative;
}

.lm_gui__slider-ctrl {
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
.lm_gui__slider-ctrl::-webkit-slider-runnable-track {
    height: 12px;
    border: none;
    border-radius: 0;
    background-color: transparent;  /* supprimé définie sur l'input */
}

/* le curseur */
.lm_gui__slider-ctrl::-webkit-slider-thumb {
    -webkit-appearance: none;       /* également nécessaire sur le curseur */
    width: 12px;
    height: inherit;                /* s'adapte à la hauteur de l'input */
    border: none;
    border-radius: 50%;               /* pris en compte sur Webkit et Edge */
    background: white;       /* pris en compte sur Webkit only */
    border: 2px solid #00a1ff;
}

.lm_gui__slider-value {
    display: inline-block;
    position: absolute;
    right: 7px;
}`;