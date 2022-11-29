import getRandomColor from '../getRandomColor';
import GUI from '../../../../src/index';

export default function folder() {
    const element = document.querySelector('#container-folder .element');

    const gui = new GUI({
        name: 'Folders',
        container: '#container-folder'
    });

    let folder_1 = gui.folder({ name: 'Folder 1' });

    folder_1.button('Button', () => {
        let color = getRandomColor();
        element.style.backgroundColor = color;
    });

    folder_1.slider({ name: 'Slider', value: 1 }, value => {
        element.style.transform = `scale(${value})`;
    });

    let folder_2 = gui.folder({ name: 'Folder 2', color: '#993333' });

    folder_2.button('Button', () => {
        element.style.backgroundColor = getRandomColor();
    });

    let folder_3 = gui.folder({ name: 'Folder 3', closed: true });

    folder_3.button('Button', () => {
        element.style.backgroundColor = getRandomColor();
    });
}