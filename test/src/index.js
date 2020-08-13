import "@babel/polyfill"

import 'normalize.css'
import './styles/main.scss'

import perfectGUI from '../../src/index'

const element = document.getElementById('element');

const gui_1 = new perfectGUI({
    name: "This is a basic panel",
    draggable: true
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
    if (!state) element.style.opacity = .5;
    else element.style.opacity = 1;
});

gui_1.addList('Select a color', ['red', 'pink', 'yellow', 'blue'], function(item) {
    element.style.backgroundColor = item;
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
    name: "This is one is closed",
    width: 175,
    closed: true,
    draggable: true
});

gui_2.addButton("Toggle the first GUI", () => {
    gui_1.toggleClose();
});

gui_2.addButton("You can put a lot of text in a button if you want to.", () => {
    element.style.backgroundColor = get_random_color();
});

const gui_3 = new perfectGUI({
    name: "You can drag panels around...",
    draggable: true
});

gui_3.addButton("...with the 'draggable' option.", () => {
    element.style.backgroundColor = get_random_color();
});

const gui_4 = new perfectGUI({
    name: "This panel is not draggable.",
    position: 'top right',
    draggable: false
});

gui_4.addButton("It's up to you.", ()=>{
    element.style.backgroundColor = get_random_color();
});

const gui_5 = new perfectGUI({
    name: "You can place the panels wherever you want",
    position: 'right bottom',
    width: 450
});

gui_5.addButton("And you can set their width, with the 'width' option.", () => {
    
});
