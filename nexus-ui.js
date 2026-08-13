
import { reproducirNota } from './audio.js';

const piano = new Nexus.Piano('#piano', {
    size: [800, 225],
    mode: 'button',
    lowNote: 60,
    highNote: 101,
}); // dibujamos el teclado con sus caracteristicas

piano.keys.forEach((key) => {
  key.colors.accent = '#61dafb'; // color cuando está presionada
  key.render();
});

function calcularFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}

const activeKeyboardNotes = new Set();

const keyboardToMidi = new Map([
  ['q', 60], ['w', 62], ['e', 64], ['r', 65], ['t', 67], ['y', 69], ['u', 71],
  ['i', 72], ['o', 74], ['p', 76], ['[', 77], [']', 79],


  ['2', 61], ['3', 63], ['5', 66], ['6', 68], ['7', 70],
  ['9', 73], ['0', 75],


  ['z', 48], ['x', 50], ['c', 52], ['v', 53], ['b', 55], ['n', 57], ['m', 59],
  [',', 60], ['.', 62], ['/', 64],

  ['s', 49], ['d', 51], ['g', 54], ['h', 56], ['j', 58],
  ['l', 61], [';', 63]
]);

function triggerPianoNote(note, isPressed) {
  const index = note - piano.range.low;
  const key = piano.keys[index];

  if (!key) return;

  if (isPressed) {
    if (activeKeyboardNotes.has(note)) return;
    activeKeyboardNotes.add(note);
    key.down();

    const freq = calcularFreq(note);
    const settings = {
      a: Number(document.querySelector('#attack').value),
      d: Number(document.querySelector('#decay').value),
      s: Number(document.querySelector('#sustain').value),
      r: Number(document.querySelector('#release').value),
    };

    reproducirNota(freq, settings);
    return;
  }

  if (!activeKeyboardNotes.has(note)) return;
  activeKeyboardNotes.delete(note);
  key.up();
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const midi = keyboardToMidi.get(key);

  if (midi === undefined || event.repeat) return;

  event.preventDefault();
  triggerPianoNote(midi, true);
});

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  const midi = keyboardToMidi.get(key);

  if (midi === undefined) return;

  event.preventDefault();
  triggerPianoNote(midi, false);
});

piano.on('change', function (v) {
    const midi = v.note;
    const isPressed = v.state === true || v.state === 1;

    if (!isPressed) return;

    const freq = calcularFreq(midi);
    const settings = {
        a: Number(document.querySelector('#attack').value),
        d: Number(document.querySelector('#decay').value),
        s: Number(document.querySelector('#sustain').value),
        r: Number(document.querySelector('#release').value),
    };

    reproducirNota(freq, settings);
});


