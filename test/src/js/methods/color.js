import GUI from '../../../../src/index';

export default function color() {
    const element = document.querySelector('#container-color .element');

    const gui = new GUI({
        container: '#container-color',
        draggable: true
    });

    gui.color({ name: 'Color', value: '#06ff89' }, color => {
        element.style.backgroundColor = color;
    });
}