import "@babel/polyfill"

import 'normalize.css'
import './styles/main.scss'

import perfectGUI from '../../../src/es6/index'

const element = document.getElementById('element');

const gui_1 = new perfectGUI({
    name: "You can name and size instances..."
});

gui_1.addImage({
    image: 'https://images.unsplash.com/photo-1485254767195-60704c46702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80',
    text: "Background 1",
    onclick: () => {
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1485254767195-60704c46702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80)`;
        document.body.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by Joel Filipe on Unsplash";
    }
});
gui_1.addImage({
    image: 'https://images.unsplash.com/photo-1535370976884-f4376736ab06?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80',
    text: "Background 2",
    onclick: () => {
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1535370976884-f4376736ab06?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80)`;
        document.body.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by Richard M. on Unsplash";
    }
});
gui_1.addImage({
    image: 'https://images.unsplash.com/photo-1524721696987-b9527df9e512?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1490&q=80',
    text: "Background 3",
    onclick: () => {
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1524721696987-b9527df9e512?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1490&q=80)`;
        document.body.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by Cassi Josh on Unsplash";
    }
});
gui_1.addButton({
    text: "Random background color",
    onclick: () => {
        document.body.style.backgroundImage = `none`;
        document.body.style.backgroundColor = get_random_color();
        document.getElementById('note').textContent = "";
    }
});
gui_1.addButton({
    text: "Random element color",
    onclick: () => {
        element.style.backgroundColor = get_random_color();
    }
});
gui_1.addSlider({
    text: "Scale",
    min: .1,
    max: 2,
    value: 1,
    step: .01,
    oninput: (value) => {
        element.style.transform = `scale(${value})`;
    }
});
gui_1.addSlider({
    text: "Border-radius",
    min: 0,
    max: 50,
    value: 0,
    step: 25,
    oninput: (value) => {
        element.style.borderRadius = `${value}%`;
    }
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

gui_2.addButton({
    text: "Toggle the first GUI",
    onclick: function() {
        gui_1.toggleClose();
    }
});
gui_2.addButton({
    text: "Multiple line button text",
    onclick: () => {
        alert('Yay');
    }
});