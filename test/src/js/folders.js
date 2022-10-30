import getRandomColor from './getRandomColor';
import perfectGUI from '../../../src/index';

export default function folders() {
    const element = document.querySelector('#container-3 .element');

    const gui = new perfectGUI({
        name: 'Folders',
        container: '#container-3'
    });

    let folder_1 = gui.folder({ name: 'Folder 1 (open)' });

    folder_1.button('Random color', () => {
        element.style.backgroundColor = getRandomColor();
    });

    folder_1.slider({ name: 'Size', value: 1 }, value => {
        element.style.transform = `scale(${value})`;
    });

    let folder_2 = gui.folder({ name: 'Folder 2 (closed)', closed: true });

    folder_2.button('Random color', () => {
        element.style.backgroundColor = getRandomColor();
    });
}