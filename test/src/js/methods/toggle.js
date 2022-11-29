import GUI from '../../../../src/index';

export default function toggle() {
    const element = document.querySelector('#container-toggle .element');

    const gui = new GUI({
        container: '#container-toggle',
        draggable: true
    });

    gui.toggle({ name: 'Toggle', value: true }, state => {
        if ( state ) element.classList.remove('round');
        else element.classList.add('round');
    });
}