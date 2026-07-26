import type GUI from '../index.js';

export type Options = {
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    tooltip?: string;
};

export default class Slider {
    private parent: GUI;
    private propReferences: string[];
    private min: number;
    private max: number;
    private step: number;
    private decimals: number;
    private obj: any;
    private prop: string;
    private callback: ((value: number) => void) | null = null;
    
    private ctrlDiv: HTMLDivElement & { 
        pointerDown?: boolean; 
        prevPosition?: number; 
        pointerDelta?: number 
    };
    private handle: HTMLElement & { position?: number };
    private filling: HTMLElement;
    private valueInput: HTMLInputElement;

    public element: HTMLElement;
    
    constructor(parent: GUI, obj: any, prop: string, options: Options = {}) {
        this.parent = parent;
        this.propReferences = [];

        if (obj && typeof obj === 'object' && typeof prop === 'string') {
            this.obj = obj;
            this.prop = prop;
        } else {
            throw Error(`[GUI] slider() invalid parameters.`);
        }

        let label = typeof options.label == 'string' ? options.label || ' ' : ' ';

        if (label == ' ') {
            label = this.prop;
        }

        this.min = options.min ?? 0;
        this.max = options.max ?? 1;
        this.step = options.step || (this.max - this.min) / 100;
        this.decimals = this.parent._countDecimals(this.step);

        const propReferenceIndex = this.propReferences.push(this.obj[this.prop]) - 1;
        const tooltip =
            typeof options.tooltip === 'string'
                ? options.tooltip
                : options.tooltip === true
                  ? label
                  : null;

        const container = document.createElement('div');
        container.className = 'p-gui__slider';

        if (tooltip) {
            container.setAttribute('title', tooltip);
        }

        this.parent.wrapper.append(container);
        
        // Expose the DOM element
        this.element = container;

        const slider_name = document.createElement('div');
        slider_name.className = 'p-gui__slider-name';
        slider_name.textContent = label;
        container.append(slider_name);

        this.ctrlDiv = document.createElement('div');
        this.ctrlDiv.prevPosition = 0;
        this.ctrlDiv.className = 'p-gui__slider-ctrl';
        this.ctrlDiv.setAttribute('type', 'range');
        this.ctrlDiv.setAttribute('min', String(this.min));
        this.ctrlDiv.setAttribute('max', String(this.max));
        container.append(this.ctrlDiv);

        const slider_bar = document.createElement('div');
        slider_bar.className = 'p-gui__slider-bar';
        this.ctrlDiv.append(slider_bar);

        this.handle = document.createElement('div');
        this.handle.className = 'p-gui__slider-handle';
        this.ctrlDiv.append(this.handle);

        this.filling = document.createElement('div');
        this.filling.className = 'p-gui__slider-filling';
        slider_bar.append(this.filling);

        this.valueInput = document.createElement('input');
        this.valueInput.className = 'p-gui__slider-value';
        this.valueInput.value = this.obj[this.prop];
        container.append(this.valueInput);

        // init position
        setTimeout(() => {
            const sliderWidth = this.ctrlDiv.offsetWidth;
            const handleWidth = this.handle.offsetWidth;
            this.handle.position = this.parent._mapLinear(
                parseFloat(this.valueInput.value),
                this.min,
                this.max,
                handleWidth / 2,
                sliderWidth - handleWidth / 2,
            );
            this.handle.position = Math.min(
                this.handle.position,
                sliderWidth - handleWidth / 2,
            );
            this.handle.position = Math.max(
                this.handle.position,
                handleWidth / 2,
            );
            this.handle.style.transform = `translate(-50%, -50%) translateX(${this.handle.position}px)`;
            this.filling.style.width = `${this.handle.position}px`;
        }, 0); // wait for render

        this.valueInput.addEventListener('change', () => {
            this._updateHandlePositionFromValue();
            this._triggerCallbacks();
        });

        this.ctrlDiv.addEventListener('pointerdown', (evt) => {
            this.ctrlDiv.pointerDown = true;
            this.ctrlDiv.prevPosition = evt.clientX;
            this._updateHandlePositionFromPointer(evt, true);
        });

        window.addEventListener('pointerup', () => {
            this.ctrlDiv.pointerDown = false;
        });

        window.addEventListener('pointercancel', () => {
            this.ctrlDiv.pointerDown = false;
        });

        window.addEventListener('pointermove', (evt) => {
            if (this.ctrlDiv.pointerDown) {
                this.ctrlDiv.pointerDelta =
                    evt.clientX - (this.ctrlDiv.prevPosition ?? 0);
                this._updateHandlePositionFromPointer(evt);
            }
        });

        Object.defineProperty(this.obj, this.prop, {
            set: (val) => {
                this.propReferences[propReferenceIndex] = val;
                this.valueInput.value = val;

                this._updateHandlePositionFromValue();

                if (this.callback) {
                    this.callback(parseFloat(this.valueInput.value));
                }
            },
            get: () => {
                return this.propReferences[propReferenceIndex];
            },
        });
    }

    _updateHandlePositionFromPointer(evt: PointerEvent, firstDown = false) {
        const rect = this.ctrlDiv.getBoundingClientRect();
        const sliderWidth = rect.width;
        const handleWidth = this.handle.offsetWidth;
        const pointerDelta = evt.clientX - (this.ctrlDiv.prevPosition ?? 0);
        const currentValue = parseFloat(this.valueInput.value);
        let handlePosition;

        if (firstDown) {
            handlePosition = evt.clientX - rect.left;
        } else {
            handlePosition = (this.handle.position ?? 0) + pointerDelta;
        }

        handlePosition = Math.max(
            handleWidth / 2,
            Math.min(handlePosition, sliderWidth - handleWidth / 2),
        );

        let newValue =
            this.min +
            ((this.max - this.min) * (handlePosition - handleWidth / 2)) /
                (sliderWidth - handleWidth);
        if (newValue > currentValue) {
            newValue = this._quantizeFloor(newValue, this.step);
        } else {
            newValue = this._quantizeCeil(newValue, this.step);
        }

        // toFixed(9) avoids weird javascript infinite decimals
        newValue = parseFloat(newValue.toFixed(9));
        const nextValue = parseFloat((currentValue + this.step).toFixed(9));
        const prevValue = parseFloat((currentValue - this.step).toFixed(9));

        if (newValue >= nextValue || newValue <= prevValue) {
            newValue = parseFloat(newValue.toFixed(this.decimals));

            this.valueInput.value = String(newValue);

            this.ctrlDiv.prevPosition = evt.clientX;

            this.handle.style.transform = `translate(-50%, -50%) translateX(${handlePosition}px)`;
            this.handle.position = handlePosition;

            this.filling.style.width = this.handle.position + 'px';

            this._triggerCallbacks();
        }
    }

    _updateHandlePositionFromValue() {
        const sliderWidth = this.ctrlDiv.offsetWidth;
        const handleWidth = this.handle.offsetWidth;
        let handlePosition = this.parent._mapLinear(
            parseFloat(this.valueInput.value),
            this.min,
            this.max,
            handleWidth / 2,
            sliderWidth - handleWidth / 2,
        );

        handlePosition = Math.max(
            handleWidth / 2,
            Math.min(handlePosition, sliderWidth - handleWidth / 2),
        );

        this.handle.style.transform = `translate(-50%, -50%) translateX(${handlePosition}px)`;
        this.handle.position = handlePosition;

        this.filling.style.width = this.handle.position + 'px';
    }

    _triggerCallbacks() {
        this.obj[this.prop] = parseFloat(this.valueInput.value);

        if (this.parent.onUpdate) {
            this.parent.onUpdate();
        } else if (this.parent.isFolder && this.parent.firstParent.onUpdate) {
            this.parent.firstParent.onUpdate();
        }
    }

    _quantize(x: number, step: number): number {
        return step * Math.round(x / step);
    }

    _quantizeCeil(x: number, step: number): number {
        return step * Math.ceil(x / step);
    }

    _quantizeFloor(x: number, step: number): number {
        return step * Math.floor(x / step);
    }

    onChange(callback: (value: number) => void) {
        this.callback = callback;
        return this;
    }
}
