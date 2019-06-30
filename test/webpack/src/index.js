import "@babel/polyfill"

import 'normalize.css'
import './styles/main.scss'

import perfectGUI from '../../../src/es6/index'

const element = document.getElementById('element');

const gui_1 = new perfectGUI({
    name: "You can name and size instances..."
});

gui_1.addImage(
    'Background 1',
    'https://images.unsplash.com/photo-1485254767195-60704c46702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80',
    () => {
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1485254767195-60704c46702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80)`;
        document.body.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by Joel Filipe on Unsplash";
    }
);
gui_1.addImage(
    'Background 2',
    'https://images.unsplash.com/photo-1535370976884-f4376736ab06?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80',
    () => {
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1535370976884-f4376736ab06?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80)`;
        document.body.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by Richard M. on Unsplash";
    }
);
gui_1.addImage(
    'Background 3',
    'https://images.unsplash.com/photo-1524721696987-b9527df9e512?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1490&q=80',
    () => {
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1524721696987-b9527df9e512?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1490&q=80)`;
        document.body.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by Cassi Josh on Unsplash";
    }
);

/* gui_1.addButton("Random background color", () => {
        document.body.style.backgroundImage = `none`;
        document.body.style.backgroundColor = get_random_color();
        document.getElementById('note').textContent = "";
}); */
gui_1.addButton("Random element color", () => {
        element.style.backgroundColor = get_random_color();
});

gui_1.addSlider("Scale", {min: .1, max: 2, value: 1, step: .01 }, (value) => {
        element.style.transform = `scale(${value})`;
});
gui_1.addSlider("3-step border-radius", {min: 0, max: 50, value: 0, step: 25 }, (value) => {
        element.style.borderRadius = `${value}%`;
});

gui_1.addSwitch("Opacity switch", true, (state) => {
    if (!state) element.style.opacity = 0;
    else element.style.opacity = 1;
});

gui_1.addList('Select one', ['apple', 'banana', 'peach'], function(item) {
    console.log('Selected item: ' + item);
});

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
};

const gui_2 = new perfectGUI({
    name: "...and drag and close them!",
    width: 175,
    closed: true
});

gui_2.addButton("Toggle the first GUI", () => {
    gui_1.toggleClose();
});
gui_2.addButton("Multiple line button text", () => {
    alert('Yay');
});