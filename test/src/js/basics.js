import perfectGUI from '../../../src/index';
import getRandomColor from './getRandomColor';

export default function basics() {

    const element = document.querySelector('#container-1 .element');

    const gui_1 = new perfectGUI({
        name: 'Basics',
        container: '#container-1'
    });

    gui_1.addButton('Button', () => {
        element.style.backgroundColor = getRandomColor();
        element.style.backgroundImage = 'none';
    });

    gui_1.addSlider('Slider', 
        { min: 0, max: 2, value: 1, step: .01 }, 
        value => element.style.transform = `scale(${ value })`
    );

    gui_1.addSwitch('Switch', true, state => {
        if ( state ) element.classList.remove('round');
        else element.classList.add('round');
    });

    gui_1.addList('List', ['red', 'pink', 'yellow', 'blue'], item => {
        element.style.backgroundColor = item;
        element.style.backgroundImage = 'none';
    });

    gui_1.addImage('Image 1',
        'https://images.unsplash.com/photo-1485254767195-60704c46702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=512&q=80',
        path => {
            element.style.backgroundImage = `url(${path})`;
            document.querySelector('#container-1 .note').textContent = "Photo by Joel Filipe on Unsplash";
        }
    );

    gui_1.addImage('Image 2',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=512&q=80',
        path => {
            element.style.backgroundImage = `url(${path})`;
            document.querySelector('#container-1 .note').textContent = "Photo by Milad Fakurian on Unsplash";
        }
    );

}