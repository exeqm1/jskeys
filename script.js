import { setWaveType } from './audio.js';
import './nexus-ui.js';

const sliderValues = {
  attack: 0.1,
  decay: 0.1,
  sustain: 0.5,
  release: 0.5,
};

window.getSynthSettings = () => ({
  a: Number(document.querySelector('#attack')?.value ?? sliderValues.attack),
  d: Number(document.querySelector('#decay')?.value ?? sliderValues.decay),
  s: Number(document.querySelector('#sustain')?.value ?? sliderValues.sustain),
  r: Number(document.querySelector('#release')?.value ?? sliderValues.release),
});

const modal = document.getElementById("modal");
const modalTitle = modal.querySelector("#modal-title");
const modalBody = modal.querySelector(".modal__body"); //capturamos elementos

const modalContent = {
  //definimos el contenido de los atributos q se van a mostrar en el modal (estos van a cambiar segun lo que toquemos)
  "como-usar": {
    title: "Cómo usar",
    body: `<ul>
                  <li>Hace clic en las teclas del piano.</li>
                  <li>O usa las teclas <strong>A S D F G H J</strong> para tocar las notas.</li>
                </ul>`,
  },
  sobre: {
    title: "Sobre",
    body: `<p>Proyecto de práctica para usar Web Audio API, y de paso familiarizarme con JavaScript.</p>
                 <p>Proximamente agregaré más características: mas notas, mas tipos de sonidos y si es posible, un generador de acordes con reproductor y .midi disponible para la descarga.</p>`,
  },
};

function openModal(key) {
  //recibe un key (arriba definidos como "como-usar" y "sobre")
  const content = modalContent[key]; //busca su contenido
  if (!content) return; //check para evitar errores

  modalTitle.textContent = content.title; //cambia el titulo del modal por el q encontro en la key
  modalBody.innerHTML = content.body; //cambia el contenido del body del modal por el q encontro en la key (usamos innerHTML porque el contenido tiene etiquetas html, si usara textContent se mostrarian las etiquetas como texto normal y no se interpretarian como html)
  modal.classList.add("modal--open"); //agregamos la clase modla open para mosrarlo (sino seguiria con display: none)
}

function closeModal() {
  modal.classList.remove("modal--open"); //se esconde el modal
}

document.querySelectorAll("nav a[data-modal]").forEach((link) => {
  //recorre todos los enlaces del nav que tengan el atributo data-modal, y a cada uno le asigna un evento de click para abrir el modal correspondiente
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const key = link.getAttribute("data-modal"); //captura su data-modal (que es la key que se le asigno, "como-usar" o "sobre")
    openModal(key); //abre el modal
  });
});

modal.addEventListener("click", (event) => {
  //maneja el cierre del modal si uno de los elementos (en este caso el modal--overlay) tiene la data-attribute close.
  if (event.target.hasAttribute("data-close")) {
    closeModal();
  }
});

// Lógica para el selector de onda personalizado
const customSelectWrapper = document.getElementById("wave-type-selector");
const customSelectHeader = customSelectWrapper.querySelector(
  ".custom-select-header",
);
const selectedValueSpan = customSelectHeader.querySelector(".selected-value");
const customSelectOptions = customSelectWrapper.querySelector(
  ".custom-select-options",
);
const customOptions = customSelectOptions.querySelectorAll(".custom-option");

// Inicializar el valor seleccionado y la clase 'selected'
selectedValueSpan.textContent = "Square"; // Valor inicial
selectedValueSpan.dataset.value = "square";
customSelectOptions
  .querySelector('.custom-option[data-value="square"]')
  .classList.add("selected");

customSelectHeader.addEventListener("click", () => {
  customSelectOptions.classList.toggle("open");
  customSelectHeader.classList.toggle("open");
});

customSelectHeader.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    customSelectOptions.classList.toggle("open");
    customSelectHeader.classList.toggle("open");
  } else if (event.key === "Escape") {
    customSelectOptions.classList.remove("open");
    customSelectHeader.classList.remove("open");
  }
});

customOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const newValue = option.dataset.value;
    selectedValueSpan.textContent = option.textContent;
    selectedValueSpan.dataset.value = newValue;
    setWaveType(newValue); // Actualiza el tipo de onda

    // Remover 'selected' de la opción anterior y añadir a la nueva
    customSelectOptions
      .querySelector(".custom-option.selected")
      ?.classList.remove("selected");
    option.classList.add("selected");

    customSelectOptions.classList.remove("open");
    customSelectHeader.classList.remove("open");
  });
});

// Cerrar el dropdown si se hace clic fuera
document.addEventListener("click", (event) => {
  if (!customSelectWrapper.contains(event.target)) {
    customSelectOptions.classList.remove("open");
    customSelectHeader.classList.remove("open");
  }
});

window.addEventListener("keydown", (event) => {
  //para q se cierre con escape.
  if (event.key === "Escape" && modal.classList.contains("modal--open")) {
    closeModal();
  }
});

const sliders = document.querySelectorAll(".slider");

sliders.forEach((slider) => {
  function updateProgress() {
    const progreso = slider.value * 100;
    slider.style.setProperty("--progress", progreso + "%");
  }

  slider.addEventListener("input", () => {
    updateProgress();

    const sliderId = slider.id;
    if (sliderId in sliderValues) {
      sliderValues[sliderId] = Number(slider.value);
    }

    const visor = document.getElementById(`${sliderId}-value`);
    if (visor) {
      visor.textContent = slider.value;
    }
  });

  updateProgress();
});

// 1. Seleccionamos todos los grupos de sliders
const grupos = document.querySelectorAll('.slider-group');

grupos.forEach(grupo => {
    const slider = grupo.querySelector('input[type="range"]');
    const visor = grupo.querySelector('.value');

    slider.addEventListener('input', () => {
        visor.textContent = slider.value;
    });
});

