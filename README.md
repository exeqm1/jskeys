# Piano Web Interactivo

Proyecto de madrugada. Un piano funcional desarrollado con tecnologías web nativas. Permite tocar notas musicales tanto con el mouse como con el teclado de la computadora, incluyendo una interfaz de información mediante modales.

![jskeys-logo](/resources/logo.png)
![jskeys](/resources/sc-pianojs.jpg)

## Demo
https://jskeys-sandy.vercel.app/

## Tecnologías utilizadas
- **HTML5**: Estructura semántica y atributos de datos.
- **CSS3 (BEM)**: Diseño moderno, efectos de desenfoque (glassmorphism) y variables globales.
- **JavaScript Vanilla**: Lógica de sonido mediante Web Audio API y manipulación del DOM.

## Características
- **Generacion de sonido mediante Web Audio API**: Se generan internamente square shapes para cada nota.
- **Mapeo de Teclado**: Control total con las teclas de la PC.
- **Interfaz Modal**: Ventanas emergentes informativas.
- **Responsive**: Adaptado para diferentes tamaños de pantalla.

## Proximamente
Para mas adelante planeo incorporar mas tecnologicas y caracteristicas:
- Posibilidad de elegir el tipo de onda (square, sine o saw) para poder modificar el sonido saliente.
- Herramientas que permitan modificar el ASDR de la onda. Esto permitiria tener un sonido customizable en cuanto a control de volumen (Ataque, Sustain, Delay y Release).
- Un generador de progresion de acordes basico con triadas que duren 4 compases y se adapten a una serie de configuraciones que elija el usuario.
- Un generador de archivo .midi para esta progresion de acordes.

## Lo que aprendí en este proyecto:
- Uso de variables en CSS y algunas caractaristicas CSS3
- Metodología **BEM** para un CSS organizado y escalable.
- Implementacion de ventanitas internas usando modales.
- Uso de la **Web Audio API** para generación de sonido.
- Uso de data-attributes (sumamente utiles para evitar codigos repetitivos).
- Gestión de despliegue continuo con **Vercel**.
