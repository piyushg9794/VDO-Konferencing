import createRoom from './Js/createRoom.js';
import joinRoom from './Js/joinRoom.js'
import hangUp from './Js/hangUp.js';

mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));

document.querySelector('#hangupBtn').addEventListener('click', hangUp);
document.querySelector('#createBtn').addEventListener('click', createRoom);
document.querySelector('#joinBtn').addEventListener('click', joinRoom);
