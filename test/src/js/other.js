import getRandomColor from './getRandomColor';
import GUI from '../../../src/index';

const container = '#container-4';

export default function other() {
    const gui_1 = new GUI({
        container,
        name: 'GUI 1 (drag me!)',
        width: 500,
        draggable: true
    });
    gui_1.button('Custom width using the `width` option', () => {});

    const gui_2 = new GUI({
        container,
        name: 'GUI 2 (drag me!)',
        close: true,
        draggable: true,
        position: 'bottom left'
    });

    gui_2.button('gui_1.toggleClose();', () => {
        gui_1.toggleClose();
    });

    const gui_3 = new GUI({
        container,
        name: 'GUI 3 (closed)',
        closed: true,
    });

    gui_3.button('gui_2.toggleClose();', () => {
        gui_2.toggleClose();
    });
}