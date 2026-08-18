const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); //creamos el audio context
export const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.5;
masterGain.connect(audioCtx.destination);
window.masterGain = 0.5;

setInterval(() => {
  if (typeof window.masterGain === 'number') {
    masterGain.gain.value = window.masterGain;
  }
}, 50);

let currentWaveType = "square"; //waveform default una squaree

function ensureAudio() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
} // los web browser por defecto suelen desactivar los audiocontext

export function reproducirNota(
  freq,
  {
    a = 0.1,
    d = 0.1,
    s = 0.5,
    r = 0.5,
    type = currentWaveType,
    cutoff = 2200,
    resonance = 1.5,
  } = {},
) {
  ensureAudio();

  const peak = 0.18;
  const sustainLevel = peak * s;

  const osc = audioCtx.createOscillator(); //creamos un oscilador
  const gain = audioCtx.createGain(); // creamos un gain controller (que podemos automatizarlo para simular un asdr)
  const lpf = audioCtx.createBiquadFilter();

  lpf.type = 'lowpass';
  lpf.frequency.setValueAtTime(cutoff, audioCtx.currentTime);
  lpf.Q.setValueAtTime(resonance, audioCtx.currentTime);

  osc.type = type; // le asignamos al oscilador la forma de onda q el user elija
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime); //la freq asociada al osc cambiara en el momomento que le indicamos (audiocontext.currentime oseea AHORA)

  // envelope ADSR
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(peak, audioCtx.currentTime + a);
  gain.gain.linearRampToValueAtTime(
    sustainLevel,
    audioCtx.currentTime + a + d,
  );
  gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + a + d + r);

  osc.connect(gain).connect(lpf).connect(masterGain); //linkeamos el osc con el gain y lo conectamos a la salida del audio
  osc.start(); //aca empieza realmente el sonido
  osc.stop(audioCtx.currentTime + a + d + r + 0.05); //aca cortamos la oscilacion con un margen de 50ms
}

export function setWaveType(type) {
  currentWaveType = type;
}

export function getWaveType() {
  return currentWaveType;
}
