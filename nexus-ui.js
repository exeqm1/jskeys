
import { reproducirNota } from './audio.js';
import { masterGain } from './audio.js';

const piano = new Nexus.Piano('#piano', {
    size: [680, 190],
    mode: 'button',
    lowNote: 60,
    highNote: 101,
}); // dibujamos el teclado con sus caracteristicas

var oscilloscope = new Nexus.Oscilloscope('#oscilloscope',{
  'size': [250,120]
})
oscilloscope.connect(masterGain);
oscilloscope.colors.fill = "#505050";
oscilloscope.render();



window.masterGain = 0.5;
window.controlValues = {
  attack: 0.1,
  decay: 0.1,
  sustain: 0.5,
  release: 0.5,
  cutoff: 2200,
  resonance: 1.5,
};

const gainDial = new Nexus.Dial('#gain-dial', {
  size: [60, 60],
  interaction: 'vertical',
  min: 0,
  max: 1,
  step: 0.01,
  value: 0.5,
});

gainDial.colors.accent = '#61dafb';
gainDial.render();

gainDial.on('change', function (value) {
  window.masterGain = Number(value);
});

function makeSlider(targetId, config, key, formatValue) {
  const slider = new Nexus.Slider(targetId, config);
  slider.colors.accent = '#61dafb';
  slider.render();

  slider.on('change', function (value) {
    const numericValue = Number(value);
    window.controlValues[key] = numericValue;

    const valueNode = document.getElementById(`${key}-value`);
    if (valueNode) {
      valueNode.textContent = formatValue(numericValue);
    }
  });

  return slider;
}

const adsrDials = {
  attack: makeSlider('#attack-dial', { size: [15, 100], mode: 'relative', min: 0, max: 1, step: 0.01, value: 0.1 }, 'attack', (value) => Number(value).toFixed(2)),
  decay: makeSlider('#decay-dial', { size: [15, 100], mode: 'relative', min: 0, max: 1, step: 0.01, value: 0.1 }, 'decay', (value) => Number(value).toFixed(2)),
  sustain: makeSlider('#sustain-dial', { size: [15, 100], mode: 'relative', min: 0, max: 1, step: 0.01, value: 0.5 }, 'sustain', (value) => Number(value).toFixed(2)),
  release: makeSlider('#release-dial', { size: [15, 100], mode: 'relative', min: 0, max: 1, step: 0.01, value: 0.5 }, 'release', (value) => Number(value).toFixed(2)),
  cutoff: makeSlider('#cutoff-dial', { size: [100, 15], mode: 'relative', min: 200, max: 12000, step: 10, value: 2200 }, 'cutoff', (value) => Math.round(value)),
  resonance: makeSlider('#resonance-dial', { size: [100, 15], mode: 'relative', min: 0.1, max: 10, step: 0.1, value: 1.5 }, 'resonance', (value) => Number(value).toFixed(1)),
};



Object.keys(adsrDials).forEach((key) => {
  const valueNode = document.getElementById(`${key}-value`);
  if (valueNode) {
    const currentValue = window.controlValues[key];
    valueNode.textContent = key === 'cutoff'
      ? Math.round(currentValue)
      : Number(currentValue).toFixed(key === 'resonance' ? 1 : 2);
  }
});

piano.keys.forEach((key) => {
  key.colors.accent = '#61dafb'; // color cuando está presionada
  key.render();
});

function calcularFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}

const activeKeyboardNotes = new Set();

const keyboardToMidi = new Map([
  ['q', 72], ['w', 74], ['e', 76], ['r', 77], ['t', 79], ['y', 81], ['u', 83],
  ['i', 84], ['o', 86], ['p', 88], ['[', 89], [']', 91],


  ['2', 73], ['3', 75], ['5', 78], ['6', 80], ['7', 82],
  ['9', 85], ['0', 87],


  ['z', 60], ['x', 62], ['c', 64], ['v', 65], ['b', 67], ['n', 69], ['m', 71],
  [',', 72], ['.', 74], ['/', 76],

  ['s', 61], ['d', 63], ['g', 66], ['h', 68], ['j', 70],
  ['l', 73], [';', 75]
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
      a: Number(window.controlValues.attack),
      d: Number(window.controlValues.decay),
      s: Number(window.controlValues.sustain),
      r: Number(window.controlValues.release),
      cutoff: Number(window.controlValues.cutoff),
      resonance: Number(window.controlValues.resonance),
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
        a: Number(window.controlValues.attack),
        d: Number(window.controlValues.decay),
        s: Number(window.controlValues.sustain),
        r: Number(window.controlValues.release),
        cutoff: Number(window.controlValues.cutoff),
        resonance: Number(window.controlValues.resonance),
    };

    reproducirNota(freq, settings);
});


