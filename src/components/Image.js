export default class Image {
    constructor(parent, params = {}, callback) {
        this.parent = parent;

        if (typeof params != 'object') {
            throw Error(`[GUI] image() first parameter must be an object. Received: ${typeof params}.`);
        }
        
        let path;
        if (typeof params.path == 'string') {
            path = params.path;
        } else {
            if (typeof params.path == undefined) {
                throw Error(`[GUI] image() path must be provided.`);
            } else {
                throw Error(`[GUI] image() path must be a string.`);
            }
        }
        let filename = path.replace(/^.*[\\\/]/, '');
        let label;
        if (params.label == undefined) {
            label = filename;
        } else {
            label = typeof params.label == 'string' ? params.label || ' ' : ' ';
        }

        const tooltip = (typeof params.tooltip === 'string') ? params.tooltip : (params.tooltip === true ? label : null);

        const selected = params.selected === true;
        const selectionBorder = params.selectionBorder !== false;
        
        // width & height options
        let inline_styles = '';
        if (params.width) {
            if (typeof params.width == 'number') {
                params.width += 'px';
            }
            inline_styles += `flex: 0 0 calc(${params.width} - 5px); `;
        }
        
        if (params.height) {
            if (typeof params.height == 'number') {
                params.height += 'px';
            }
            inline_styles += `height: ${params.height}; `;
        }   

        // Image button
        const image = document.createElement('div');
        image.className = 'p-gui__image';
        image.style = 'background-image: url(' + path + '); ' + inline_styles;
        if ( tooltip ) {
            image.setAttribute('title', tooltip);
        }

        if (selected && selectionBorder) {
            image.classList.add('p-gui__image--selected');
        }
        
        // Text inside image
        const text = document.createElement('div');
        text.className = 'p-gui__image-text';
        text.textContent = label;
        image.append(text);
        
        image.addEventListener('click', () => {
            let selected_items = image.parentElement.querySelectorAll('.p-gui__image--selected');
            for (let i = 0; i < selected_items.length; i++) {
                selected_items[i].classList.remove('p-gui__image--selected');
            }
            if (selectionBorder) {
                image.classList.add('p-gui__image--selected');
            }
            if (typeof callback == 'function') {
                callback({ path, text: label });
            }
            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (this.parent.isFolder && this.parent.firstParent.onUpdate) {
                this.parent.firstParent.onUpdate();
            }
        });

        return image;   
    }
}