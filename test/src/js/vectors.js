import perfectGUI from '../../../src/index';

export default function vectors() {

    window.data = {
        foo: 5,
        bar: 10
    }

    const element = document.querySelector('#container-vectors .element');

    const gui = new perfectGUI({
        name: 'Vectors',
        container: '#container-vectors'
    });

    gui.addVector2('Foo / Bar', {
        x: { object: window.data, prop: 'foo', min: 0, max: 10 },
        y: { object: window.data, prop: 'bar', min: 0, max: 10 },
    });
}