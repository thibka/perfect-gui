import './styles/prism.css';
import './styles/styles.css';
//import demo from './js/demo';
import './js/prism';
import basics from './js/basics';
import vectors from './js/vectors';
import multiple from './js/multiple';
import folders from './js/folders';
import other from './js/other';
import kill_create from './js/kill_create';

let subtitle = ['probably not', 'maybe not', 'almost', 'nearly'];
subtitle = subtitle[Math.floor(Math.random() * subtitle.length)];
document.getElementById('subtitle-random').textContent = subtitle;

//demo();

basics();

vectors();

multiple();

folders();

other();

kill_create();