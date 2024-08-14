import GUI from '../index.js';

/* 
    GUI.prototype.materialFolder = materialFolder;
    gui.materialFolder({name: 'material', obj: material})
*/
export function materialFolder(params = {}) {
    const material = params.obj;

    if (material.isMeshStandardMaterial) {
        console.error('[GUI materialFolder]', 'materialFolder() only works with meshStandardMaterial');
    }

    const folder = this.folder({ name: params.name });

    folder.slider({ obj: material, prop: 'roughness' });
    folder.slider({ obj: material, prop: 'metalness' });
    folder.color({ name: 'color', obj: material, value: '#'+material.color.getHexString() }, val => {
        material.color.set(val)
    });
    folder.slider({ obj: material, prop: 'envMapIntensity' });
    return folder;
}

export function threejsColor() {

}