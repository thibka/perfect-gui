import GUI from '../../../../src/index';

export default function vector2() {
    const position = {
        x: 0,
        y: 0
    }

    const element = document.querySelector('#container-vector2 .element');

    const gui = new GUI({
        container: '#container-vector2',
    });

    gui.vector2({ name: 'Position',
        x: { obj: position, prop: 'x', min: -50, max: 50 },
        y: { obj: position, prop: 'y', min: -50, max: 50 },
    }, (x, y) => {
        element.style.transform = `translate(${x}px, ${-y}px)`;
    });
}