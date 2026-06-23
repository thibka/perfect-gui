import type GUI from '../index.js';

export type Options = {
    label?: string;
    tooltip?: string | boolean;
    selected?: boolean;
    selectionBorder?: boolean;
    width?: number | string;
    height?: number | string;
}

type Callback = ({path, text}: {path: string, text: string}) => void;

export default class Image {
    public parent: GUI;

    private callback: null | Callback = null;

    private element: HTMLElement;

    constructor(parent: GUI, path: string, params: Options = {}) {
        this.parent = parent;

        if (path === undefined) {
            throw Error(`[GUI] image() path must be provided.`);
        } else if (typeof path !== 'string') {
            throw Error(`[GUI] image() path must be a string.`);
        }

        if (typeof params !== 'object') {
            throw Error(
                `[GUI] image() second parameter must be an object. Received: ${typeof params}.`,
            );
        }
        let filename = path.replace(/^.*[\\\/]/, '');
        let label;
        if (params.label == undefined) {
            label = filename;
        } else {
            label = typeof params.label == 'string' ? params.label || ' ' : ' ';
        }

        const tooltip =
            typeof params.tooltip === 'string'
                ? params.tooltip
                : params.tooltip === true
                  ? label
                  : null;

        const selected = params.selected === true;
        const selectionBorder = params.selectionBorder !== false;

        // width & height options
        let inline_styles = '';
        if (params.width) {
            let width = params.width;
            if (typeof width === 'number') {
                width = `${width}px`;
            }
            inline_styles += `flex: 0 0 calc(${width} - 5px); `;
        }

        if (params.height) {
            let height = params.height;
            if (typeof height == 'number') {
                height = `${height}px`;
            }
            inline_styles += `height: ${height}; `;
        }

        // Image button
        const image = document.createElement('div');
        image.className = 'p-gui__image';
        image.style = 'background-image: url(' + path + '); ' + inline_styles;
        if (tooltip) {
            image.setAttribute('title', tooltip);
        }
        this.parent.imageContainer!.append(image);
        
        // Expose the DOM element
        this.element = image;

        if (selected && selectionBorder) {
            image.classList.add('p-gui__image--selected');
        }

        // Text inside image
        const text = document.createElement('div');
        text.className = 'p-gui__image-text';
        text.textContent = label;
        image.append(text);

        image.addEventListener('click', () => {
            let selected_items = image.parentElement?.querySelectorAll(
                '.p-gui__image--selected',
            ) || [];
            for (let i = 0; i < selected_items.length; i++) {
                selected_items[i].classList.remove('p-gui__image--selected');
            }
            if (selectionBorder) {
                image.classList.add('p-gui__image--selected');
            }
            if (typeof this.callback == 'function') {
                this.callback({ path, text: label });
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
    }

    onClick(callback: Callback) {
        this.callback = callback;
        return this;
    }
}
