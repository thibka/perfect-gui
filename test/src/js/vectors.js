import GUI from '../../../src/index';

export default function vectors() {
    const position = {
        x: 0,
        y: 0
    }

    const element = document.querySelector('#container-vectors .element');

    const gui = new GUI({
        name: 'Vectors',
        container: '#container-vectors',
    });

    gui.vector2({ name: 'Position', data: {
        x: { object: position, prop: 'x', min: -50, max: 50 },
        y: { object: position, prop: 'y', min: -50, max: 50 },
    }});

    function loop() {
        element.style.transform = `translate(${position.x}px, ${-position.y}px)`;
        requestAnimationFrame(loop);
    }
    
    loop();
}