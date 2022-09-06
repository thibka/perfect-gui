import getRandomColor from './getRandomColor';
import perfectGUI from '../../../src/index';

export default function other() {
    const gui_1 = new perfectGUI({
        container: '#container-4',
        name: 'GUI 1 (drag me!)',
        width: 500,
        draggable: true
    });
    gui_1.addButton('Custom width using the `width` option', () => {});

    const gui_2 = new perfectGUI({
        container: '#container-4',
        name: 'GUI 2 (drag me!)',
        close: true,
        draggable: true,
        position: 'bottom left'
    });

    gui_2.addButton('gui_1.toggleClose();', () => {
        gui_1.toggleClose();
    });

    const gui_3 = new perfectGUI({
        container: '#container-4',
        name: 'GUI 3 (closed)',
        closed: true,
    });

    gui_3.addButton('gui_2.toggleClose();', () => {
        gui_2.toggleClose();
    });
}