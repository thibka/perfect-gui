import type GUI from '../index.js';
import { bindSharedProp } from '../shared-prop.js';

type AxisOption = {
    min?: number;
    max?: number;
    step?: number;
}

export type Options = {
    label?: string;
    tooltip?: string;
    min?: number;
    max?: number;
    step?: number;
    x?: AxisOption; // X axis options
    y?: AxisOption; // Y axis options
    readonly?: boolean;
}

type Callback = ((x: number, y: number) => void);

export default class Vector2 {
    private callback: Callback | null;

    public element: HTMLDivElement;

    constructor(private parent: GUI, obj: any, propX: string, propY: string, options: Options = {}) {
        this.callback = null;
        const readonly = !!options.readonly;

        let objectX, objectY;

        if (
            obj &&
            typeof obj === 'object' &&
            typeof propX === 'string' &&
            typeof propY === 'string'
        ) {
            objectX = obj;
            objectY = obj;
            propX = propX;
            propY = propY;
        } else {
            throw Error(
                `[GUI] vector2() invalid parameters. Use: gui.vector2(obj, 'propX', 'propY', options)`,
            );
        }

        let label = typeof options.label == 'string' ? options.label || ' ' : ' ';
        if (label === ' ') label = propX + ' / ' + propY;

        const safeParamsX = options.x || {};
        const safeParamsY = options.y || {};

        const minX = safeParamsX.min ?? options.min ?? 0;
        const maxX = safeParamsX.max ?? options.max ?? 1;
        const minY = safeParamsY.min ?? options.min ?? 0;
        const maxY = safeParamsY.max ?? options.max ?? 1;
        const stepX = safeParamsX.step || options.step || (maxX - minX) / 100;
        const stepY = safeParamsY.step || options.step || (maxY - minY) / 100;
        const decimalsX = this.parent._countDecimals(stepX);
        const decimalsY = this.parent._countDecimals(stepY);

        const propXEntry = bindSharedProp<number>(objectX, propX);
        const propYEntry = bindSharedProp<number>(objectY, propY);

        const tooltip =
            typeof options.tooltip === 'string'
                ? options.tooltip
                : options.tooltip === true
                  ? label
                  : null;

        const container = document.createElement('div');
        container.className = 'p-gui__vector2';
        container.textContent = label;
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        if (readonly) {
            container.setAttribute('data-readonly', 'true');
        }
        this.parent.wrapper.append(container);

        // Expose the DOM element
        this.element = container;

        const vector_value = document.createElement('div');
        vector_value.className = 'p-gui__vector-value';
        vector_value.textContent = objectX[propX] + ', ' + objectY[propY];
        container.append(vector_value);

        const area = document.createElement('div');
        area.className = 'p-gui__vector2-area';
        area.setAttribute('role', 'slider');
        area.setAttribute('tabindex', readonly ? '-1' : '0');
        area.setAttribute('aria-label', label);
        if (readonly) {
            area.setAttribute('aria-readonly', 'true');
        }
        container.append(area);

        const applyValue = (rawX: number, rawY: number) => {
            if (readonly) return;

            const clampedX = Math.max(minX, Math.min(maxX, rawX));
            const clampedY = Math.max(minY, Math.min(maxY, rawY));

            objectX[propX] = parseFloat(clampedX.toFixed(decimalsX));
            objectY[propY] = parseFloat(clampedY.toFixed(decimalsY));

            if (this.callback) {
                this.callback(objectX[propX], objectY[propY]);
            }

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (
                this.parent.isFolder &&
                this.parent.firstParent.onUpdate
            ) {
                this.parent.firstParent.onUpdate();
            }
        };

        area.addEventListener('click', (evt) => {
            const mappedX = this.parent._mapLinear(
                evt.offsetX,
                0,
                area.clientWidth,
                minX,
                maxX,
            );
            const mappedY = this.parent._mapLinear(
                evt.offsetY,
                0,
                area.clientHeight,
                maxY,
                minY,
            );

            applyValue(mappedX, mappedY);
        });

        const handlePointerMove = (evt: PointerEvent) => {
            const rect = area.getBoundingClientRect();
            const offsetX = evt.clientX - rect.left;
            const offsetY = evt.clientY - rect.top;

            const mappedX = this.parent._mapLinear(
                offsetX,
                0,
                area.clientWidth,
                minX,
                maxX,
            );
            const mappedY = this.parent._mapLinear(
                offsetY,
                0,
                area.clientHeight,
                maxY,
                minY,
            );

            applyValue(mappedX, mappedY);
        };

        area.addEventListener('pointerdown', (evt) => {
            // Call handlePointerMove immediately to update position on click
            handlePointerMove(evt);

            // Attach pointermove to document to capture movements everywhere
            document.addEventListener('pointermove', handlePointerMove);

            // Clean up on pointerup
            document.addEventListener(
                'pointerup',
                () => {
                    document.removeEventListener(
                        'pointermove',
                        handlePointerMove,
                    );
                },
                { once: true },
            );
        });

        area.addEventListener('keydown', (evt) => {
            let deltaX = 0;
            let deltaY = 0;

            if (evt.key === 'ArrowRight') deltaX = stepX;
            else if (evt.key === 'ArrowLeft') deltaX = -stepX;
            else if (evt.key === 'ArrowUp') deltaY = stepY;
            else if (evt.key === 'ArrowDown') deltaY = -stepY;
            else return;

            evt.preventDefault();
            applyValue(objectX[propX] + deltaX, objectY[propY] + deltaY);
        });

        const line_x = document.createElement('div');
        line_x.className = 'p-gui__vector2-line p-gui__vector2-line-x';
        area.append(line_x);

        const line_y = document.createElement('div');
        line_y.className = 'p-gui__vector2-line p-gui__vector2-line-y';
        area.append(line_y);

        const dot = document.createElement('div');
        dot.className = 'p-gui__vector2-dot';
        area.append(dot);

        // Function to update dot position based on current values
        const updateDotPosition = () => {
            dot.style.left =
                this.parent._mapLinear(
                    objectX[propX],
                    minX,
                    maxX,
                    0,
                    area.clientWidth,
                ) + 'px';
            dot.style.top =
                this.parent._mapLinear(
                    objectY[propY],
                    minY,
                    maxY,
                    area.clientHeight,
                    0,
                ) + 'px';

            area.setAttribute(
                'aria-valuetext',
                `${objectX[propX]}, ${objectY[propY]}`,
            );
        };

        // Initial position
        updateDotPosition();

        // Observe area resize (e.g., when scrollbars appear/disappear)
        const resizeObserver = new ResizeObserver(() => {
            updateDotPosition();
        });
        resizeObserver.observe(area);

        propXEntry.listeners.add((val) => {
            updateDotPosition();
            vector_value.textContent = String(val) + ', ' + objectY[propY];
        });

        propYEntry.listeners.add((val) => {
            updateDotPosition();
            vector_value.textContent = objectX[propX] + ', ' + String(val);
        });
    }

    onChange(callback: Callback) {
        this.callback = callback;
        return this;
    }
}
