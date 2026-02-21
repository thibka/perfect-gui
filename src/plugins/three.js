/* 
    GUI.prototype.threeMaterial = threeMaterial;
    gui.threeMaterial({label: 'material', obj: material})
*/
export function threeMaterial(params = {}) {
    const material = params.obj;
    const closed = params.closed ?? false;

    if (material.isMeshStandardMaterial) {
        const folder = this.folder({ label: params.label, closed });

        folder.slider({ obj: material, prop: 'roughness' });
        folder.slider({ obj: material, prop: 'metalness' });
        folder.threeColor({ label: 'color', obj: material.color });
        folder.slider({ obj: material, prop: 'envMapIntensity' });
        folder.toggle(
            { obj: material, prop: 'transparent' },
            () => (material.needsUpdate = true),
        );
        folder.slider({ obj: material, prop: 'opacity' });

        if (material.isMeshPhysicalMaterial) {
            folder.slider({ obj: material, prop: 'transmission' });
            folder.slider({ obj: material, prop: 'thickness' });
            folder.slider({ obj: material, prop: 'ior' });
        }

        return folder;
    } else if (material.isMeshBasicMaterial) {
        const folder = this.folder({ label: params.label, closed });

        folder.threeColor({ label: 'color', obj: material.color });
        folder.toggle(
            { obj: material, prop: 'transparent' },
            () => (material.needsUpdate = true),
        );
        folder.slider({ obj: material, prop: 'opacity' });

        return folder;
    } else {
        console.error(
            '[GUI threeMaterial]',
            "threeMaterial() doesn't support this material:",
            material,
        );
    }
}

/* 
    GUI.prototype.threeColor = threeColor;
    gui.threeColor({label: 'color', obj: color})
*/
export function threeColor(params = {}) {
    const label = params.label ?? 'Color';
    const color = params.obj;

    if (!color) {
        console.error('[GUI threeColor]', 'color object not provided');
        return;
    }

    return this.color(
        { label: label, value: '#' + color.getHexString() },
        (val) => {
            color.set(val);
        },
    );
}
