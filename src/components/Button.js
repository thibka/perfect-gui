export default class Button {
    constructor(parent, params = {}) {
        this.parent = parent;
        this.callback = null;

        if (typeof params !== 'object') {
            throw Error(
                `[GUI] button() first parameter must be an object. Received: ${typeof params}.`,
            );
        }

        let label = params.label || ' ';

        const tooltip =
            typeof params.tooltip === 'string'
                ? params.tooltip
                : params.tooltip === true
                  ? label
                  : null;

        const el = document.createElement('div');
        el.className = 'p-gui__button';
        el.textContent = label;
        if (tooltip) {
            el.setAttribute('title', tooltip);
        }
        el.addEventListener('click', () => {
            if (this.callback) {
                this.callback();
            }

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (
                this.parent.isFolder &&
                this.parent.firstParent.onUpdate
            ) {
                this.parent.firstParent.onUpdate();
            }
        });

        if (typeof params.color == 'string') {
            el.style.setProperty('--color-accent', params.color);
            el.style.setProperty(
                '--color-accent-hover',
                params.hoverColor || params.color,
            );
        }

        this.parent.wrapper.append(el);
        
        // Expose the DOM element
        this.element = el;
    }

    onClick(callback) {
        this.callback = callback;
        return this;
    }
}
