const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); //creamos el audio context

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
  } = {},
) {
  ensureAudio();

  const peak = 0.18;
  const sustainLevel = peak * s;

  const osc = audioCtx.createOscillator(); //creamos un oscilador
  const gain = audioCtx.createGain(); // creamos un gain controller (que podemos automatizarlo para simular un asdr)

  osc.type = type; // le asignamos al oscilador la forma de onda q el user elija
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime); //la freq asociada al osc cambiara en el momomento que le indicamos (audiocontext.currentime oseea AHORA)

  // arranque sin click
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(peak, audioCtx.currentTime + 0.01);

  // envelope ADSR con sustain relativo al pico, sin elevar el techo
  gain.gain.linearRampToValueAtTime(peak, audioCtx.currentTime + a);
  gain.gain.linearRampToValueAtTime(sustainLevel, audioCtx.currentTime + a + d);
  gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + a + d + r);

  osc.connect(gain).connect(audioCtx.destination); //linkeamos el osc con el gain y lo conectamos la salida del sonido
  osc.start(); //aca empieza realmente el sonido
  osc.stop(audioCtx.currentTime + a + d + r + 0.05); //aca cortamos la oscilacion con un margen de 50ms
}

export function setWaveType(type) {
  currentWaveType = type;
}

export function getWaveType() {
  return currentWaveType;
}
