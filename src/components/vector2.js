export default function vector2( params = {}, callback) {
    if (typeof params != 'object') {
        throw Error(`[GUI] vector2() first parameter must be an object. Received: ${typeof params}.`);
    }

    let name = typeof params.name == 'string' ? params.name || ' ' : ' ';

    const minX = params.x.min ?? 0;
    const maxX = params.x.max ?? 1;
    const minY = params.y.min ?? 0;
    const maxY = params.y.max ?? 1;
    const stepX = params.x.step || (maxX - minX) / 100;
    const stepY = params.y.step || (maxY - minY) / 100;
    const decimalsX = this._countDecimals(stepX);
    const decimalsY = this._countDecimals(stepY);

    const objectX = params.x.obj;
    const propX = params.x.prop;
    const propXReferenceIndex = this.propReferences.push(objectX[propX]) - 1;
    
    const objectY = params.y.obj;
    const propY = params.y.prop;
    const propYReferenceIndex = this.propReferences.push(objectY[propY]) - 1;

    const tooltip = (typeof params.tooltip === 'string') ? params.tooltip : (params.tooltip === true ? name : null);

    callback = typeof callback == 'function' ? callback : null;

    this.imageContainer = null;

    const container = document.createElement('div');
    container.className = 'p-gui__vector2';
    container.textContent = name;
    if ( tooltip ) {
        container.setAttribute('title', tooltip);
    }
    this.wrapper.append(container);

    const vector_value = document.createElement('div');
    vector_value.className = 'p-gui__vector-value';
    vector_value.textContent = objectX[propX] + ', ' + objectY[propY];
    container.append(vector_value);

    const area = document.createElement('div');
    area.className = 'p-gui__vector2-area';
    container.append(area);
    area.addEventListener('click', evt => {
        const newX = parseFloat(this._mapLinear(evt.offsetX, 0, area.clientWidth, minX, maxX));
        const newY = parseFloat(this._mapLinear(evt.offsetY, 0, area.clientHeight, maxY, minY));
        objectX[propX] = newX.toFixed(decimalsX);
        objectY[propY] = newY.toFixed(decimalsY);

        if (callback) {
            callback(objectX[propX], objectX[propY]);
        }

        if (this.onUpdate) {
            this.onUpdate();
        } else if (this.isFolder && this.firstParent.onUpdate) {
            this.firstParent.onUpdate();
        }
    });
    
    let pointer_is_down = false;
    area.addEventListener('pointerdown', (evt) => {
        pointer_is_down = true;
    });
    area.addEventListener('pointerup', () => {
        pointer_is_down = false;
    });
    area.addEventListener('pointermove', (evt) => {
        if (pointer_is_down) {
            const newX = parseFloat(this._mapLinear(evt.offsetX, 0, area.clientWidth, minX, maxX));
            const newY = parseFloat(this._mapLinear(evt.offsetY, 0, area.clientHeight, maxY, minY));
            objectX[propX] = newX.toFixed(decimalsX);
            objectY[propY] = newY.toFixed(decimalsY);

            if (callback) {
                callback(objectX[propX], objectX[propY]);
            }

            if (this.onUpdate) {
                this.onUpdate();
            } else if (this.isFolder && this.firstParent.onUpdate) {
                this.firstParent.onUpdate();
            }
        }
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

    dot.style.left = this._mapLinear(objectX[propX], minX, maxX, 0, area.clientWidth) + 'px';
    dot.style.top = this._mapLinear(objectY[propY], minY, maxY, area.clientHeight, 0) + 'px';

    Object.defineProperty( objectX, propX, {
        set: val => { 
            this.propReferences[propXReferenceIndex] = val;
            dot.style.left = this._mapLinear(val, minX, maxX, 0, area.clientWidth) + 'px';
            vector_value.textContent = String( val ) + ', ' + objectY[propY];
        },
        get: () => { 
            return this.propReferences[propXReferenceIndex];
        }
    });

    Object.defineProperty( objectY, propY, {
        set: val => { 
            this.propReferences[propYReferenceIndex] = val;
            dot.style.top = this._mapLinear(val, minY, maxY, area.clientHeight, 0) + 'px';
            vector_value.textContent = objectX[propX] + ', ' + String( val );
        },
        get: () => { 
            return this.propReferences[propYReferenceIndex];
        }
    });
}