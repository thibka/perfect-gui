/* 
    GUI.prototype.threeMaterial = threeMaterial;
    gui.threeMaterial({name: 'material', obj: material})
*/
export function threeMaterial(params = {}) {
    const material = params.obj;
    const closed = params.closed ?? false;

    if (material.isMeshStandardMaterial) {
        const folder = this.folder({ name: params.name, closed });

        folder.slider({ obj: material, prop: 'roughness' });
        folder.slider({ obj: material, prop: 'metalness' });
        folder.threeColor({ name: 'color', obj: material.color });
        folder.slider({ obj: material, prop: 'envMapIntensity' });
        folder.toggle({ obj: material, prop: 'transparent' }, () => material.needsUpdate = true);
        folder.slider({ obj: material, prop: 'opacity' });

        if (material.isMeshPhysicalMaterial) {
            folder.slider({ obj: material, prop: 'transmission' });
            folder.slider({ obj: material, prop: 'thickness' });
            folder.slider({ obj: material, prop: 'ior' });
        }

        return folder;
    } 
    else if (material.isMeshBasicMaterial) {
        const folder = this.folder({ name: params.name, closed });

        folder.threeColor({ name: 'color', obj: material.color });
        folder.toggle({ obj: material, prop: 'transparent' }, () => material.needsUpdate = true);
        folder.slider({ obj: material, prop: 'opacity' });
        
        return folder;
    } 
    else {
        console.error('[GUI threeMaterial]', 'threeMaterial() doesn\'t support this material:', material);
    }
}

/* 
    GUI.prototype.threeColor = threeColor;
    gui.threeColor({name: 'color', obj: color})
*/
export function threeColor(params = {}) {
    const label = params.name ?? 'Color';
    const color = params.obj;

    if (!color) {
        console.error('[GUI threeColor]', 'color object not provided');
        return;
    }
    
    return this.color({ name: label, value: '#'+color.getHexString() }, val => {
        color.set(val)
    });
}