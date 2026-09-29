import type GUI from '../index.js';

/*
    Optional plugin adding three.js helpers to the GUI prototype:

    import GUI from 'perfect-gui';
    import { threeMaterial, threeColor } from 'perfect-gui/plugins/three.js';

    GUI.prototype.threeMaterial = threeMaterial;
    GUI.prototype.threeColor = threeColor;

    gui.threeMaterial({ label: 'material', obj: material });
    gui.threeColor({ label: 'color', obj: color });
*/

type ThreeColorLike = {
    getHexString(): string;
    set(value: string): void;
};

type ThreeMaterialLike = {
    isMeshStandardMaterial?: boolean;
    isMeshPhysicalMaterial?: boolean;
    isMeshBasicMaterial?: boolean;
    color: ThreeColorLike;
    roughness?: number;
    metalness?: number;
    envMapIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    transmission?: number;
    thickness?: number;
    ior?: number;
    needsUpdate?: boolean;
};

export type ThreeMaterialOptions = {
    label?: string;
    obj: ThreeMaterialLike;
    closed?: boolean;
};

export type ThreeColorOptions = {
    label?: string;
    obj: ThreeColorLike;
};

export function threeMaterial(this: GUI, params: ThreeMaterialOptions) {
    const material = params.obj;
    const closed = params.closed ?? false;

    if (material.isMeshStandardMaterial) {
        const folder = this.folder({ label: params.label, closed });

        folder.slider(material, 'roughness');
        folder.slider(material, 'metalness');
        threeColor.call(folder, { label: 'color', obj: material.color });
        folder.slider(material, 'envMapIntensity');
        folder.toggle(material, 'transparent').onChange(() => {
            material.needsUpdate = true;
        });
        folder.slider(material, 'opacity');

        if (material.isMeshPhysicalMaterial) {
            folder.slider(material, 'transmission');
            folder.slider(material, 'thickness');
            folder.slider(material, 'ior');
        }

        return folder;
    } else if (material.isMeshBasicMaterial) {
        const folder = this.folder({ label: params.label, closed });

        threeColor.call(folder, { label: 'color', obj: material.color });
        folder.toggle(material, 'transparent').onChange(() => {
            material.needsUpdate = true;
        });
        folder.slider(material, 'opacity');

        return folder;
    } else {
        console.error(
            '[GUI threeMaterial]',
            'threeMaterial() doesn\'t support this material:',
            material,
        );
        return undefined;
    }
}

export function threeColor(this: GUI, params: ThreeColorOptions) {
    const label = params.label ?? 'Color';
    const color = params.obj;

    if (!color) {
        console.error('[GUI threeColor]', 'color object not provided');
        return undefined;
    }

    const proxy = { hex: '#' + color.getHexString() };

    return this.color(proxy, 'hex', { label }).onChange((value) => {
        color.set(value);
    });
}
