import getRandomColor from './getRandomColor';
import GUI from '../../../src/index';

const container = '#container-5';

export default function other() {
    const guis = [];

    let gui_1 = new GUI({
        container,
        name: 'GUI 1',
    });

    gui_1.addButton('Create GUI panel', () => {
        guis[guis.length] = new GUI({
            container,
            name: 'Created GUI',
            position: 'bottom left',
            width: 150
        });
    });

    gui_1.addButton('Kill GUI panel', () => {
        const index = guis.length - 1;
        if ( index >= 0 ) {
            // Removes html elements
            guis[index].wrapper.remove(); 

            // Frees up memory
            guis[index] = null;

            // Removes null value from array
            guis.splice(index, 1);
        }
    });
}