import './styles/prism.css';
import './styles/styles.css';
import './styles/_sidebar.css';
import './styles/_table.css';
//import demo from './js/demo';
import './js/prism';
import basics from './js/methods/basics';
import button from './js/methods/button';
import slider from './js/methods/slider';
import toggle from './js/methods/toggle';
import list from './js/methods/list';
import image from './js/methods/image';
import color from './js/methods/color';
import vector2 from './js/methods/vector2';
import folder from './js/methods/folder';

import multiple from './js/multiple';
import other from './js/other';
import kill_create from './js/kill_create';

let subtitle = ['probably not', 'maybe not so', 'almost', 'nearly'];
subtitle = subtitle[Math.floor(Math.random() * subtitle.length)];
document.getElementById('subtitle-random').textContent = subtitle;

//demo();
basics();
    button();
    slider();
    toggle();
    list();
    image();
    color();
    vector2();
    folder();


multiple();


other();

kill_create();