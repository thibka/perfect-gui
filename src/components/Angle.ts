import type GUI from '../index.js';

export type Unit = 'deg' | 'rad';

export type Options = {
    label?: string;
    tooltip?: string | boolean;
    unit?: Unit;
    min?: number;
    max?: number;
    step?: number;
};

const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

export default class Angle {
    private parent: GUI;
    private propReferences: number[];
    private obj: any;
    private prop: string;
    private unit: Unit;
    private minDeg: number;
    private maxDeg: number;
    private stepDeg: number;
    private decimals: number;
    private wraps: boolean;
    private callback: ((value: number) => void) | null = null;

    private dial: HTMLElement & { pointerDown?: boolean };
    private needle: HTMLElement;
    private valueInput: HTMLInputElement;

    public element: HTMLElement;

    constructor(parent: GUI, obj: any, prop: string, options: Options = {}) {
        this.parent = parent;
        this.propReferences = [];

        if (obj && typeof obj === 'object' && typeof prop === 'string') {
            this.obj = obj;
            this.prop = prop;
        } else {
            throw Error(`[GUI] angle() invalid parameters.`);
        }

        let label = typeof options.label == 'string' ? options.label || ' ' : ' ';

        if (label == ' ') {
            label = this.prop;
        }

        this.unit = options.unit === 'rad' ? 'rad' : 'deg';

        const fullTurn = this._fromDeg(360);
        const min = options.min ?? 0;
        const max = options.max ?? min + fullTurn;
        const step = options.step || this._fromDeg(1);

        this.minDeg = this._toDeg(min);
        this.maxDeg = this._toDeg(max);
        this.stepDeg = Math.abs(this._toDeg(step)) || 1;
        this.wraps = this.maxDeg - this.minDeg >= 360 - 1e-6;
        this.decimals =
            this.unit == 'rad' ? 3 : this.parent._countDecimals(step);

        const propReferenceIndex =
            this.propReferences.push(this.obj[this.prop]) - 1;
        const tooltip =
            typeof options.tooltip === 'string'
                ? options.tooltip
                : options.tooltip === true
                  ? label
                  : null;

        const container = document.createElement('div');
        container.className = 'p-gui__angle';

        if (tooltip) {
            container.setAttribute('title', tooltip);
        }

        this.parent.wrapper.append(container);

        // Expose the DOM element
        this.element = container;

        const angle_name = document.createElement('div');
        angle_name.className = 'p-gui__angle-name';
        angle_name.textContent = label;
        container.append(angle_name);

        this.dial = document.createElement('div');
        this.dial.className = 'p-gui__angle-dial';
        container.append(this.dial);

        if (!this.wraps) {
            const span = this.maxDeg - this.minDeg;
            this.dial.style.backgroundImage = `conic-gradient(from ${this.minDeg}deg, transparent ${span}deg, rgba(255, 255, 255, .2) ${span}deg)`;
        }

        this.needle = document.createElement('div');
        this.needle.className = 'p-gui__angle-needle';
        this.dial.append(this.needle);

        const handle = document.createElement('div');
        handle.className = 'p-gui__angle-handle';
        this.needle.append(handle);

        this.valueInput = document.createElement('input');
        this.valueInput.className = 'p-gui__angle-value';
        container.append(this.valueInput);

        const unit_label = document.createElement('div');
        unit_label.className = 'p-gui__angle-unit';
        unit_label.textContent = this.unit == 'rad' ? 'rad' : '°';
        container.append(unit_label);

        this._display(this._readDeg());

        this.valueInput.addEventListener('change', () => {
            const parsed = parseFloat(this.valueInput.value);
            const valueDeg = isNaN(parsed) ? this._readDeg() : this._toDeg(parsed);

            this._display(this._resolveDeg(valueDeg));
            this._triggerCallbacks();
        });

        this.dial.addEventListener('pointerdown', (evt) => {
            this.dial.pointerDown = true;
            this._updateFromPointer(evt);

            // Attach pointermove to document to capture movements everywhere
            document.addEventListener('pointermove', this._onPointerMove);
            document.addEventListener('pointerup', this._onPointerUp, {
                once: true,
            });
        });

        Object.defineProperty(this.obj, this.prop, {
            set: (val) => {
                this.propReferences[propReferenceIndex] = val;

                this._display(this._readDeg());

                if (this.callback) {
                    this.callback(val);
                }
            },
            get: () => {
                return this.propReferences[propReferenceIndex];
            },
        });
    }

    private _onPointerMove = (evt: PointerEvent) => {
        if (this.dial.pointerDown) {
            this._updateFromPointer(evt);
        }
    };

    private _onPointerUp = () => {
        this.dial.pointerDown = false;
        document.removeEventListener('pointermove', this._onPointerMove);
    };

    _updateFromPointer(evt: PointerEvent) {
        const rect = this.dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 0° points up, positive angles turn clockwise
        const pointerDeg =
            Math.atan2(evt.clientX - centerX, centerY - evt.clientY) *
            RAD_TO_DEG;

        this._display(this._resolveDeg(pointerDeg));
        this._triggerCallbacks();
    }

    /**
     * Brings an arbitrary angle into the [min, max] range, quantized on step.
     * Outside of a full turn, the closest bound wins.
     */
    _resolveDeg(deg: number): number {
        let value = this.minDeg + this._mod(deg - this.minDeg, 360);

        if (!this.wraps && value > this.maxDeg) {
            const distanceToMax = value - this.maxDeg;
            const distanceToMin = this.minDeg + 360 - value;
            value = distanceToMax < distanceToMin ? this.maxDeg : this.minDeg;
        }

        value =
            this.minDeg +
            Math.round((value - this.minDeg) / this.stepDeg) * this.stepDeg;

        if (this.wraps) {
            value = this.minDeg + this._mod(value - this.minDeg, 360);
        } else {
            value = Math.max(this.minDeg, Math.min(this.maxDeg, value));
        }

        // toFixed(9) avoids weird javascript infinite decimals
        return parseFloat(value.toFixed(9));
    }

    /** Current value in degrees, falling back to min when the prop isn't a number. */
    _readDeg(): number {
        const value = this.obj[this.prop];
        return typeof value == 'number' && isFinite(value)
            ? this._toDeg(value)
            : this.minDeg;
    }

    _display(deg: number) {
        this.needle.style.transform = `rotate(${deg - 90}deg)`;
        this.valueInput.value = this._fromDeg(deg).toFixed(this.decimals);
    }

    _triggerCallbacks() {
        this.obj[this.prop] = parseFloat(this.valueInput.value);

        if (this.parent.onUpdate) {
            this.parent.onUpdate();
        } else if (this.parent.isFolder && this.parent.firstParent.onUpdate) {
            this.parent.firstParent.onUpdate();
        }
    }

    _toDeg(value: number): number {
        return this.unit == 'rad' ? value * RAD_TO_DEG : value;
    }

    _fromDeg(deg: number): number {
        return this.unit == 'rad' ? deg * DEG_TO_RAD : deg;
    }

    _mod(x: number, m: number): number {
        return ((x % m) + m) % m;
    }

    onChange(callback: (value: number) => void) {
        this.callback = callback;
        return this;
    }
}
