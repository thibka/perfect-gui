import perfectGUI from '../../../src/index';
import getRandomColor from './getRandomColor';

export default function multiple() {
    const element = document.querySelector('#container-2 .element');

    const gui_1 = new perfectGUI({
        name: 'GUI 1',
        width: 200,
        container: '#container-2'
    });
    
    gui_1.addButton('By the way, buttons can handle multiple lines of text.', () => {
        element.style.backgroundColor = getRandomColor();
    });

    const gui_2 = new perfectGUI({
        name: 'GUI 2',
        width: 200,
        container: '#container-2'
    });
    
    gui_2.addButton('Button', () => element.style.backgroundColor = getRandomColor() );
    
    const gui_3 = new perfectGUI({
        name: 'GUI 3',
        position: 'top right',
        container: '#container-2'
    });
    
    gui_3.addButton('Button', () => element.style.backgroundColor = getRandomColor() );
    
    const gui_4 = new perfectGUI({
        name: 'GUI 4',
        position: 'right bottom',
        container: '#container-2'
    });
    
    gui_4.addButton('Button', () => element.style.backgroundColor = getRandomColor() );
}