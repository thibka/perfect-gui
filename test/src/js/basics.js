import GUI from '../../../src/index';
import getRandomColor from './getRandomColor';

export default function basics() {

    const foo = {
        bar: 1
    };

    const element = document.querySelector('#container-1 .element');

    const gui = new GUI({
        name: 'Basics',
        container: '#container-1'
    });

    gui.addButton('Button', () => {
        element.style.backgroundColor = getRandomColor();
        element.style.backgroundImage = 'none';
    });

    gui.addSlider('Slider (simple callback)', 
        { min: 0, max: 2, value: 1, step: .01 }, 
        value => element.style.transform = `scale(${ value })`
    );

    gui.addSlider('Slider 2 (object binding)',
        { object: foo, prop: 'bar', min: 0, max: 2, step: .01 }
    );

    gui.addSwitch('Switch', true, state => {
        if ( state ) element.classList.remove('round');
        else element.classList.add('round');
    });

    gui.addList('List', ['red', 'pink', 'yellow', 'blue'], item => {
        element.style.backgroundColor = item;
        element.style.backgroundImage = 'none';
    });

    gui.addImage('Image 1',
        'https://images.unsplash.com/photo-1485254767195-60704c46702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=512&q=80',
        evt => {
            element.style.backgroundImage = `url(${evt.path})`;
            document.querySelector('#container-1 .note').textContent = "Photo by Joel Filipe on Unsplash";
        }
    );

    gui.addImage('Image 2',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=512&q=80',
        evt => {
            element.style.backgroundImage = `url(${evt.path})`;
            document.querySelector('#container-1 .note').textContent = "Photo by Milad Fakurian on Unsplash";
        }
    );

}