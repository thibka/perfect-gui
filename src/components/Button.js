export default class Slider {
    constructor(parent, params = {}, callback) {
        this.parent = parent;

        let label = '';
        if (typeof params != 'string') {
            if (typeof params == 'object' && params?.hasOwnProperty('label')) {
                label = params.label == '' ? ' ' : params.label;
            } else {
                label = ' ';
            }
        } else {
            label = params == '' ? ' ' : params;
        }

        const tooltip = (typeof params.tooltip === 'string') ? params.tooltip : (params.tooltip === true ? label : null);
        
        const el = document.createElement('div');
        el.className = 'p-gui__button';
        el.textContent = label;
        if ( tooltip ) {
            el.setAttribute('title', tooltip);
        }
        el.addEventListener('click', () => {
            if (callback) {
                callback();
            }

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (this.parent.isFolder && this.parent.firstParent.onUpdate) {
                this.parent.firstParent.onUpdate();
            }
        });

        if (typeof params.color == 'string') {
            el.style.setProperty('--color-accent', params.color);
            el.style.setProperty('--color-accent-hover', params.hoverColor || params.color);
        }

        return el;
    }
}