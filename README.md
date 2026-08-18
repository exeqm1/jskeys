# Piano Web Interactivo

Un piano funcional desarrollado con tecnologías web nativas. Permite tocar notas musicales tanto con el mouse como con el teclado de la computadora, incluyendo una interfaz de información mediante modales.

![jskeys-logo](/resources/logo.png)
![jskeys](/resources/jskeys.jpg)

### Demo
https://jskeys-sandy.vercel.app/

### Tecnologías utilizadas
- **HTML5**: Estructura semántica y atributos de datos.
- **CSS3 (BEM)**: Diseño moderno, efectos de desenfoque (glassmorphism) y variables globales.
- **JavaScript Vanilla**: Lógica de sonido mediante Web Audio API y manipulación del DOM.

### Características
- **Generacion de sonido mediante Web Audio API**: Se generan internamente square shapes para cada nota.
- **Mapeo de Teclado**: Control total con las teclas de la PC.
- **Interfaz Modal**: Ventanas emergentes informativas.
- **Responsive**: Adaptado para diferentes tamaños de pantalla.

### Proximamente
Para mas adelante planeo incorporar mas tecnologicas y caracteristicas:
- ~~Posibilidad de elegir el tipo de onda (square, sine o saw) para poder modificar el sonido saliente.~~ ✔️
- ~~Herramientas que permitan modificar el ASDR de la onda. Esto permitiria tener un sonido customizable en cuanto a control de volumen (Ataque, Sustain, Delay y Release).~~ ✔️
- Un generador de progresion de acordes basico con triadas que duren 4 compases y se adapten a una serie de configuraciones que elija el usuario.
- Un generador de archivo .midi para esta progresion de acordes.
- Controlador de ganancia como volumen general.
- EQ incorporado.
- Efectos, LFO's y filtros.
  
## UPDATE!!!! version 0.1.0-beta !
Nuevo sistema con teclado virtual implementando el framework de [NexusUI](https://github.com/nexus-js/ui) (buenarda para ui de vsts y plugins de audio en web)
- **Teclado de 3 octavas con interfaz cheta de NexusUI**: Diseño minimalista y moderno.
- **Teclado de PC funcional y utilizabl**: Podes tocar con el teclado de la compu con una distribucion similar a la del mapeo de teclas de FL Studio.
- **Controles ASDR**: Controles que modifican la ganancia dandole formas al volumen del sonido.

