
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
    }

    console.log('piano event:', v);
    console.log('midi:', midi);
    console.log('freq:', freq);
    console.log('settings:', settings);

    reproducirNota(freq, settings);
});


