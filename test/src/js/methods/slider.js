import GUI from '../../../../src/index';
import getRandomColor from '../getRandomColor';

export default function slider() {
    const element = document.querySelector('#container-slider .element');
    const position = {
        x: 0,
    };

    const gui = new GUI({
        container: '#container-slider',
        draggable: true
    });

    gui.slider({ name: 'Simple slider (value & callback)', value: 1 }, 
        value => {
            element.style.opacity = value;
        }
    );

    gui.slider({ name: 'Slider with object binding', obj: position, prop: 'x', min: -30, max: 30 },
        () => {
            element.style.transform = `translateX(${position.x}px)`;
        }
    );
}