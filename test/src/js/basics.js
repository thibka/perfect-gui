import GUI from '../../../src/index';
import getRandomColor from './getRandomColor';

export default function basics() {
    const position = {
        x: 0,
    };

    const element = document.querySelector('#container-1 .element');

    const gui = new GUI({
        name: 'Basics',
        container: '#container-1',
        draggable: true
    });

    gui.button('Button', () => {
        element.style.backgroundColor = getRandomColor();
        element.style.backgroundImage = 'none';
    });

    gui.slider({ name: 'Slider (simple callback)', value: 1 }, 
        value => {
            element.style.opacity = value;
        }
    );

    gui.slider({ name: 'Slider 2 (object binding)', obj: position, prop: 'x', min: -30, max: 30, step: .1 });

    gui.toggle('Switch', true, state => {
        if ( state ) element.classList.remove('round');
        else element.classList.add('round');
    });

    gui.list('List', ['red', 'pink', 'yellow', 'blue'], item => {
        element.style.backgroundImage = 'none';
        element.style.backgroundColor = item;
    });

    gui.image('Image 1',
        'https://images.unsplash.com/photo-1485254767195-60704c46702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=512&q=80',
        evt => {
            element.style.backgroundImage = `url(${evt.path})`;
            document.querySelector('#container-1 .note').textContent = "Photo by Joel Filipe on Unsplash";
        }
    );

    gui.image('Image 2',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=512&q=80',
        evt => {
            element.style.backgroundImage = `url(${evt.path})`;
            document.querySelector('#container-1 .note').textContent = "Photo by Milad Fakurian on Unsplash";
        }
    );

    gui.color('Color', '#ff0000', color => {
        element.style.backgroundImage = 'none';
        element.style.backgroundColor = color;
    });

    function loop() {
        element.style.transform = `translateX(${position.x}px)`;
        requestAnimationFrame(loop);
    }
    
    loop();
}