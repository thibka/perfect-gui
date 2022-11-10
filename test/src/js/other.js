import getRandomColor from './getRandomColor';
import GUI from '../../../src/index';

const container = '#container-4';

export default function other() {
    const gui_1 = new GUI({
        container,
        name: 'GUI 1 (drag me!)',
        width: 500,
        draggable: true,
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
        name: 'GUI 3 (closed, scrollable)',
        closed: true,
    });

    let f1 = gui_3.folder({ name: 'folder', color: '#33329f' });
    for (let i = 0; i < 3; i ++) {
        f1.button('btn '+ i, () => {});
    }
    let f2 = gui_3.folder({ name: 'folder', color: '#9f3293' });
    for (let i = 0; i < 3; i ++) {
        f2.button('btn '+ i, () => {});
    }
    for (let i = 0; i < 10; i ++) {
        gui_3.button('btn '+ i, () => {});
    }

    const gui_4 = new GUI({
        container,
        position: 'bottom right',
        name: 'GUI 4 (custom color)',
        color: '#226666'
    });
    gui_4.button('lorem', () => {});
}