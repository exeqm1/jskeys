const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      function ensureAudio() {
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }
      }

      const frecuencias = {
        C4: 261.63,
        D4: 293.66,
        E4: 329.63,
        F4: 349.23,
        G4: 392.0,
        A4: 440.0,
        B4: 493.88,
      };

      const keyMap = {
        KeyA: "C4",
        KeyS: "D4",
        KeyD: "E4",
        KeyF: "F4",
        KeyG: "G4",
        KeyH: "A4",
        KeyJ: "B4",
      };

      function reproducirNota(note, { duration = 1, type = "square" } = {}) {
        ensureAudio();
        const freq = frecuencias[note]; //obtenemos la frequencia de la nota
        if (!freq) return;

        const osc = audioCtx.createOscillator(); //se crea el oscilador (sonido)
        const gain = audioCtx.createGain(); //se crea lo que seria el modificador de volumen (como si fuera un ASDR)

        osc.type = type; //se le asigna el tipo de onda al oscilador
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime); //se le asigna la frequencia al oscilador y que suene en el momento en q es presionado

        gain.gain.setValueAtTime(0, audioCtx.currentTime); //empezamos con volumen en 0, tiempo: ahora, al momento de ser presionada la tecla
        gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.01); //hacemos un pequeño fade in para evitar el click del sonido, subimos a 0.18 en 10ms (fade imperceptible)
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration); //este es nuestro fade out, bajamos a 0.001 en el tiempo que dura la nota (1 segundo por defecto)

        osc.connect(gain).connect(audioCtx.destination); //se conecta el oscilador al gain y este a su vez a la salida de audio (altavoces)
        osc.start(); //inicia
        osc.stop(audioCtx.currentTime + duration + 0.02); //se detiene el oscilador un poco después de que termine el fade out para asegurarnos que no se corte el sonido
      }

      function flashKey(el) { //funcion para agregar la clase active a la tecla presionada y removerla despues de 120ms para el efecto flash
        el.classList.add("active");
        setTimeout(() => el.classList.remove("active"), 120);
      }

      document.querySelectorAll(".key").forEach((button) => { //seleccionamos todas las teclas del pianito y a cada una:
        button.addEventListener("pointerdown", () => { //le asignamos un evento de pointerdown (funciona para mouse y teclas)
          const note = button.dataset.note; //capturamos la nota asignada a esa tecla (data-note)
          reproducirNota(note); //reproducimos la nota.
          flashKey(button); //(efecto flash)
        });
      });

      window.addEventListener("keydown", (event) => { //llistener universal para detectar cuando se presiona una tecla del teclado, y reproducir la nota correspondiente si es que esa tecla esta asignada a una nota
        if (event.repeat) return; //esto evita que se repita el sonido si la tecla se mantiene presionada
        const note = keyMap[event.code]; //se busca dentro de keymap si la tecla presionada (event.code) tiene una nota asignada, y se captura esa nota
        if (!note) return; //si la tecla presionada no tiene una nota asignada se sale mediante el return
        const button = document.querySelector(`.key[data-note="${note}"]`); //se busca una tecla que cumpla con 2 condiciones: que tenga la clase .key y que su datanote sea igual a la nota capturada (${note} funciona como una variable temporal donde se guarda el valor de la nota, cambia cada vez q se presiona otra tecla, si no usara esto y en su lugar pusiera directamente el nombre de la nota, por ejemplo C4, entonces solo funcionaria esa tecla y no las demas)
        if (button) {
          reproducirNota(note);
          flashKey(button);
        }
      });

      //explicacion logica modal

      const modal = document.getElementById("modal");
      const modalTitle = modal.querySelector("#modal-title");
      const modalBody = modal.querySelector(".modal__body"); //capturamos elementos

      const modalContent = { //definimos el contenido de los atributos q se van a mostrar en el modal (estos van a cambiar segun lo que toquemos)
        "como-usar": {
          title: "Cómo usar",
          body: `<ul>
                  <li>Hace clic en las teclas del piano.</li>
                  <li>O usa las teclas <strong>A S D F G H J</strong> para tocar las notas.</li>
                </ul>`,
        },
        "sobre": {
          title: "Sobre",
          body: `<p>Proyecto de práctica para usar Web Audio API, y de paso familiarizarme con JavaScript.</p>
                 <p>Proximamente agregaré más características: mas notas, mas tipos de sonidos y si es posible, un generador de acordes con reproductor y .midi disponible para la descarga.</p>`,
        },
      };

      function openModal(key) { //recibe un key (arriba definidos como "como-usar" y "sobre")
        const content = modalContent[key]; //busca su contenido
        if (!content) return; //check para evitar errores

        modalTitle.textContent = content.title; //cambia el titulo del modal por el q encontro en la key
        modalBody.innerHTML = content.body; //cambia el contenido del body del modal por el q encontro en la key (usamos innerHTML porque el contenido tiene etiquetas html, si usara textContent se mostrarian las etiquetas como texto normal y no se interpretarian como html)
        modal.classList.add("modal--open"); //agregamos la clase modla open para mosrarlo (sino seguiria con display: none)
      }

      function closeModal() {
        modal.classList.remove("modal--open"); //se esconde el modal
      }

      document.querySelectorAll("nav a[data-modal]").forEach((link) => { //recorre todos los enlaces del nav que tengan el atributo data-modal, y a cada uno le asigna un evento de click para abrir el modal correspondiente
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const key = link.getAttribute("data-modal");//captura su data-modal (que es la key que se le asigno, "como-usar" o "sobre")
          openModal(key); //abre el modal
        });
      });

      modal.addEventListener("click", (event) => { //maneja el cierre del modal si uno de los elementos (en este caso el modal--overlay) tiene la data-attribute close.
        if (event.target.hasAttribute("data-close")) {
          closeModal();
        }
      });

      window.addEventListener("keydown", (event) => { //para q se cierre con escape.
        if (event.key === "Escape" && modal.classList.contains("modal--open")) {
          closeModal();
        }
      });