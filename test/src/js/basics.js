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

    gui.slider({ name: 'Slider 2 (object binding)', obj: position, prop: 'x', min: -30, max: 30, step: .1 },
        () => {
            element.style.transform = `translateX(${position.x}px)`;
        }
    );

    gui.toggle('Toggle', true, state => {
        if ( state ) element.classList.remove('round');
        else element.classList.add('round');
    });

    gui.list('List', ['red', 'pink', 'yellow', 'blue'], item => {
        element.style.backgroundImage = 'none';
        element.style.backgroundColor = item;
    });

    gui.image('Image 1 lorem ipsum',
        'https://raw.githubusercontent.com/thibka/thibka.github.io/master/perfect-gui/_data/img/DALL·E-2022-11-13-20.11.16---portrait-of-a-squirrel-in-an-officier-suit,-style-of-a-Rembrandt-painting.jpg',
        evt => {
            element.style.backgroundImage = `url(${evt.path})`;
        }
    );

    gui.image('Image 2',
        'https://raw.githubusercontent.com/thibka/thibka.github.io/master/perfect-gui/_data/img/DALL·E-2022-11-13-20.11.52---a-blonde-girl-riding-a-whale-in-the-style-of-hopper.jpg',
        evt => {
            element.style.backgroundImage = `url(${evt.path})`;
        }
        );
        
    gui.image('Image 3',
        'https://raw.githubusercontent.com/thibka/thibka.github.io/master/perfect-gui/_data/img/DALL·E-2022-11-13-20.13.55---1-blonde-haired-girl-with-her-orange-cat,-watching-the-whales-in-Tadoussac,-Canada.-In-the-style-of-an-oil-painting..jpg',
        evt => {
            element.style.backgroundImage = `url(${evt.path})`;
        }
    );

    gui.color('Color', '#ff0000', color => {
        element.style.backgroundImage = 'none';
        element.style.backgroundColor = color;
    });
}