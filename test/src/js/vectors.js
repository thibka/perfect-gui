import GUI from '../../../src/index';

export default function vectors() {
    const data = {
        x: 0,
        y: 0
    }

    const element = document.querySelector('#container-vectors .element');

    const gui = new GUI({
        name: 'Vectors',
        container: '#container-vectors'
    });

    gui.vector2('Position', {
        x: { object: data, prop: 'x', min: -50, max: 50 },
        y: { object: data, prop: 'y', min: -50, max: 50 },
    });

    function loop() {
        element.style.transform = `translate(${data.x}px, ${-data.y}px)`;
        requestAnimationFrame(loop);
    }
    
    loop();
}