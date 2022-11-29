import GUI from '../../../../src/index';
import getRandomColor from '../getRandomColor';

export default function button() {
    const element = document.querySelector('#container-button .element');

    const gui = new GUI({
        container: '#container-button',
        draggable: true
    });

    gui.button('Button', () => {
        element.style.backgroundColor = getRandomColor();
    });
}