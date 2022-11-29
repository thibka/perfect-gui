import GUI from '../../../../src/index';

export default function image() {
    const element = document.querySelector('#container-image .element');

    const gui = new GUI({
        container: '#container-image',
        draggable: true
    });

    gui.image({ name: 'Lorem ipsum',
        path: 'https://raw.githubusercontent.com/thibka/thibka.github.io/master/perfect-gui/_data/img/DALL·E-2022-11-13-20.11.16---portrait-of-a-squirrel-in-an-officier-suit,-style-of-a-Rembrandt-painting.jpg'},
        evt => {
            element.style.backgroundImage = `url( ${evt.path} )`;
        }
    );
}