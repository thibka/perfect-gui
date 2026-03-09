export default class Vector2 {
    constructor(parent, arg1, arg2, arg3, arg4) {
        this.parent = parent;
        this.callback = null;

        let params = {};
        let objectX, objectY, propX, propY;

        if (
            arg1 &&
            typeof arg1 === 'object' &&
            typeof arg2 === 'string' &&
            typeof arg3 === 'string'
        ) {
            objectX = arg1;
            objectY = arg1;
            propX = arg2;
            propY = arg3;
            params = arg4 || {};
        } else if (arg1 && typeof arg1 === 'object' && arg1.x && arg1.x.obj) {
            // Backwards compatibility for the old verbose { x: { obj, prop }, y: { obj, prop } } structure
            // incase it's heavily used, since Vector2 doesn't have a 'simple' mode.
            params = arg1;
            objectX = params.x.obj;
            propX = params.x.prop;
            objectY = params.y.obj;
            propY = params.y.prop;
        } else {
            throw Error(
                `[GUI] vector2() invalid parameters. Use: gui.vector2(obj, 'propX', 'propY', params)`,
            );
        }

        let label = typeof params.label == 'string' ? params.label || ' ' : ' ';
        if (label === ' ') label = propX + ' / ' + propY;

        const safeParamsX = params.x || {};
        const safeParamsY = params.y || {};

        const minX = safeParamsX.min ?? params.min ?? 0;
        const maxX = safeParamsX.max ?? params.max ?? 1;
        const minY = safeParamsY.min ?? params.min ?? 0;
        const maxY = safeParamsY.max ?? params.max ?? 1;
        const stepX = safeParamsX.step || params.step || (maxX - minX) / 100;
        const stepY = safeParamsY.step || params.step || (maxY - minY) / 100;
        const decimalsX = this.parent._countDecimals(stepX);
        const decimalsY = this.parent._countDecimals(stepY);

        const propXReferenceIndex =
            this.parent.propReferences.push(objectX[propX]) - 1;
        const propYReferenceIndex =
            this.parent.propReferences.push(objectY[propY]) - 1;

        const tooltip =
            typeof params.tooltip === 'string'
                ? params.tooltip
                : params.tooltip === true
                  ? label
                  : null;

        const container = document.createElement('div');
        container.className = 'p-gui__vector2';
        container.textContent = label;
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        this.parent.wrapper.append(container);

        const vector_value = document.createElement('div');
        vector_value.className = 'p-gui__vector-value';
        vector_value.textContent = objectX[propX] + ', ' + objectY[propY];
        container.append(vector_value);

        const area = document.createElement('div');
        area.className = 'p-gui__vector2-area';
        container.append(area);
        area.addEventListener('click', (evt) => {
            const newX = parseFloat(
                this.parent._mapLinear(
                    evt.offsetX,
                    0,
                    area.clientWidth,
                    minX,
                    maxX,
                ),
            );
            const newY = parseFloat(
                this.parent._mapLinear(
                    evt.offsetY,
                    0,
                    area.clientHeight,
                    maxY,
                    minY,
                ),
            );
            objectX[propX] = newX.toFixed(decimalsX);
            objectY[propY] = newY.toFixed(decimalsY);

            if (this.callback) {
                this.callback(objectX[propX], objectX[propY]);
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

        const handlePointerMove = (evt) => {
            const rect = area.getBoundingClientRect();
            const offsetX = evt.clientX - rect.left;
            const offsetY = evt.clientY - rect.top;

            // Calculate new values and clamp them within min/max bounds
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

            const clampedX = Math.max(minX, Math.min(maxX, mappedX));
            const clampedY = Math.max(minY, Math.min(maxY, mappedY));

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
        };

        // Initial position
        updateDotPosition();

        // Observe area resize (e.g., when scrollbars appear/disappear)
        const resizeObserver = new ResizeObserver(() => {
            updateDotPosition();
        });
        resizeObserver.observe(area);

        Object.defineProperty(objectX, propX, {
            set: (val) => {
                this.parent.propReferences[propXReferenceIndex] = val;
                updateDotPosition();
                vector_value.textContent = String(val) + ', ' + objectY[propY];
            },
            get: () => {
                return this.parent.propReferences[propXReferenceIndex];
            },
        });

        Object.defineProperty(objectY, propY, {
            set: (val) => {
                this.parent.propReferences[propYReferenceIndex] = val;
                updateDotPosition();
                vector_value.textContent = objectX[propX] + ', ' + String(val);
            },
            get: () => {
                return this.parent.propReferences[propYReferenceIndex];
            },
        });
    }

    onChange(callback) {
        this.callback = callback;
        return this;
    }
}
