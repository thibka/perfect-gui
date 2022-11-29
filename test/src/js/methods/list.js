import GUI from '../../../../src/index';

export default function list() {
    const element = document.querySelector('#container-list .element');

    const gui = new GUI({
        container: '#container-list',
        draggable: true
    });

    gui.list({ name: 'List', values: ['red', 'pink', 'yellow', 'blue'] }, selected_value => {
        element.style.backgroundColor = selected_value;
    } );
}