import GUI from '../../../src/index';
import getRandomColor from './getRandomColor';

export default function multiple() {
    const element = document.querySelector('#container-2 .element');

    const gui_1 = new GUI({
        name: 'GUI 1',
        width: 200,
        container: '#container-2'
    });
    
    gui_1.button('By the way, buttons can handle multiple lines of text.', () => {
        element.style.backgroundColor = getRandomColor();
    });

    const gui_2 = new GUI({
        name: 'GUI 2',
        width: 200,
        container: '#container-2'
    });
    
    gui_2.button('Button', () => element.style.backgroundColor = getRandomColor() );
    
    const gui_3 = new GUI({
        name: 'GUI 3',
        position: 'top left',
        container: '#container-2'
    });
    
    gui_3.button('Button', () => element.style.backgroundColor = getRandomColor() );
    
    const gui_4 = new GUI({
        name: 'GUI 4',
        position: 'right bottom',
        container: '#container-2'
    });
    
    gui_4.button('Button', () => element.style.backgroundColor = getRandomColor() );
}