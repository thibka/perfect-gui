import getRandomColor from './getRandomColor';
import perfectGUI from '../../../src/index';

export default function folders() {
    const element = document.querySelector('#container-3 .element');

    const gui = new perfectGUI({
        name: 'Folders',
        container: '#container-3'
    });

    let folder_1 = gui.addFolder('Folder 1 (open)');

    folder_1.addButton("Random color", () => {
        element.style.backgroundColor = getRandomColor();
    });

    let folder_2 = gui.addFolder('Folder 2 (closed)', { closed: true });

    folder_2.addButton("Random color", () => {
        element.style.backgroundColor = getRandomColor();
    });
}