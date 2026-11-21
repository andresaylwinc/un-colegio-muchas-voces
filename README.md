# Un colegio: Muchas voces

Sitio web estático de demostración de la lista **Un colegio: Muchas voces**, para
presentar candidaturas a la dirección nacional del Colegio de Periodistas de Chile,
con cinco nombres a nivel nacional y candidaturas en las dieciséis regiones.

No usa frameworks, dependencias instalables ni proceso de build: son archivos HTML,
CSS y JavaScript que se abren directamente en el navegador.

---

## Cómo verlo

1. Abre `index.html` con doble clic en tu navegador.
2. La guía de diseño está en `diseno.html`.
3. Si prefieres servirlo por HTTP (recomendado para publicar):

   ```bash
   # Python
   python -m http.server 8000

   # o con Node
   npx serve .
   ```

   Luego visita `http://localhost:8000`.

Las tipografías se cargan desde Google Fonts. Sin conexión, el sitio funciona igual
con las pilas de respaldo del sistema definidas en `styles.css`.

---

## Estructura

| Archivo        | Contenido                                                        |
| -------------- | ---------------------------------------------------------------- |
| `index.html`   | Portada: hero, ideas fuerza, lista nacional, regiones, puntos, contacto |
| `diseno.html`  | Guía de diseño: tres paletas de color y tres paquetes tipográficos |
| `styles.css`   | Tokens de diseño, componentes, responsive y estilos de la guía    |
| `main.js`      | Menú móvil, WhatsApp, validación del formulario, animaciones      |
| `img/candidatos/` | Fotografías optimizadas de las candidaturas de ejemplo         |
| `capturas/`    | Capturas de referencia del sitio terminado                        |

El sitio incluye:

- Mosaico de candidaturas y presentación de la lista nacional.
- **Cinco candidaturas nacionales** con presentación extendida (presidencia destacada
  + secretaría general, tesorería y dos direcciones).
- **Dieciséis candidaturas regionales** con texto breve.
- Cuatro ideas fuerza y seis puntos de trabajo.
- Formulario de contacto con validación accesible en el navegador.
- Botón flotante de WhatsApp en todas las pantallas.
- Menú móvil, navegación por anclas y animaciones suaves que respetan
  `prefers-reduced-motion`.

Las candidaturas nacionales combinan nombres y fotografías de ejemplo —**Carlos
Valverde**, **Elías Barticevic** y **Pamela Hidalgo**— con textos *Lorem ipsum*. La
presidencia y la segunda dirección siguen siendo referenciales, al igual que las
dieciséis candidaturas regionales. Los cargos asignados a las tres personas son
provisionales y se pueden cambiar en `index.html`.

---

## Personalización rápida

### 1. WhatsApp

En `main.js`, al inicio, están las tres constantes que controlan todos los enlaces
del sitio (botón flotante, CTA, contacto y pie):

```js
var WHATSAPP_NUMBER = '56900000000'; // formato internacional, sin + ni espacios
var WHATSAPP_DISPLAY = '+56 9 0000 0000';
var WHATSAPP_MESSAGE = 'Hola, escribo desde el sitio de Un colegio: Muchas voces...';
```

### 2. Correo y datos de contacto

Busca `contacto@listanacional.cl` y `+56 9 0000 0000` en `index.html` y reemplázalos.
La dirección y el horario también están en la sección de contacto y en el pie.

### 3. Nombres, cargos y textos

Los candidatos están en `index.html`, en este orden:

1. `#lista-nacional`: bloque destacado de la presidencia y cuatro tarjetas.
2. `#regiones`: dieciséis tarjetas, una por región.

En esta versión de ejemplo, Carlos Valverde aparece en **Secretaría General**, Elías
Barticevic en **Tesorería** y Pamela Hidalgo en **Dirección**. Antonia Vergara Ruiz
(presidencia) y Fernanda Olivares Díaz (segunda dirección) siguen siendo
referenciales. Cambia los nombres, cargos y fotos según corresponda.

Cada tarjeta sigue la misma estructura (píldora del cargo, nombre, rol, párrafos).
Reemplaza los párrafos Lorem ipsum por las presentaciones definitivas. Las
presentaciones nacionales ya tienen más espacio y dos párrafos; las regionales, un
texto breve.

### 4. Fotografías

Las versiones web de las tres fotos están en `img/candidatos/` (1000 × 1250 px, JPG).
Los archivos originales quedaron en `fotosCandidatos/`, fuera del repositorio mediante
`.gitignore`.

Para cambiar una foto, reemplaza el archivo manteniendo el nombre o actualiza el
`src`:

```html
<div class="photo ph-a">
  <img src="img/candidatos/nombre-apellido.jpg" alt="Retrato de Nombre Apellido" width="1000" height="1250">
</div>
```

El CSS cubre la imagen con `object-fit: cover`; puedes ajustar el encuadre con
`object-position` en `.photo img`. Para los bloques que aún no tienen foto, mantén el
`photo-mark` con las iniciales y su `role="img"`.

La foto de Pamela Hidalgo conserva en sus metadatos la autoría de Hugo Cruz
(`hugocruzfotografia@gmail.com`). Confirma la autorización de uso antes de publicar.

### 5. Paleta y tipografía

El sitio arranca con **Paleta 1 · Tinta y papel** y **Paquete A · Editorial
contemporánea**. Para cambiar la combinación, edita los atributos de `<html>`:

```html
<html lang="es-CL" data-palette="2" data-fonts="b">
```

También puedes previsualizar sin editar el archivo:

- `index.html?paleta=2`
- `index.html?fuentes=b`
- `index.html?paleta=3&fuentes=c`

La guía `diseno.html` muestra las muestras y enlaza a cada combinación. Los tokens
viven al comienzo de `styles.css`, en los bloques `:root` / `[data-palette]` /
`[data-fonts]`.

### 6. Conectar el formulario

Ahora el formulario valida en el navegador y muestra una confirmación de
demostración; **no envía datos**. Para conectarlo a Formspree, Netlify Forms o una
API propia:

1. Agrega el atributo `action` y `method` reales al `<form>`:

   ```html
   <form id="contact-form" action="https://formspree.io/f/TU_ID" method="post" novalidate>
   ```

2. En `main.js`, reemplaza el bloque final del envío (el que muestra
   `successPanel`) por el envío real:

   ```js
   fetch(form.action, {
     method: 'POST',
     body: new FormData(form),
     headers: { Accept: 'application/json' }
   })
     .then(function (response) {
       if (!response.ok) throw new Error('Error de envío');
       successPanel.hidden = false;
       form.hidden = true;
       formIntro.hidden = true;
       successPanel.focus({ preventScroll: true });
       successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
     })
     .catch(function () {
       statusLine.textContent = 'No pudimos enviar el mensaje. Intenta por correo o WhatsApp.';
     });
   ```

3. Ajusta el texto de `#form-success` en `index.html` para que describa el envío real.

### 7. Quitar el aviso de demostración

- Barra superior: elimina el bloque `<div class="demo-bar">` en `index.html` (y el CSS
  `.demo-bar*` si lo deseas).
- Pie: ajusta el texto de `.footer-bottom` para quitar la mención de demostración.
- Formulario: elimina el párrafo `.form-note` cuando el envío esté operativo.

---

## Sistema de diseño

### Tres paletas

| # | Nombre              | Fondo     | Primario  | Acento    | Intención                                  |
| - | ------------------- | --------- | --------- | --------- | ------------------------------------------ |
| 1 | Tinta y papel       | `#F8F5EF` | `#1F4E6B` | `#B45F33` | Editorial e institucional, cálida y serena |
| 2 | Verde cívico        | `#F5F7F2` | `#1E5245` | `#C4862B` | Cercana y territorial, con acento mostaza  |
| 3 | Ciruela y ladrillo  | `#F7F4F8` | `#4A3562` | `#B2504F` | Contemporánea, con carácter y elegancia    |

Cada paleta define además tinta, fondos alternos, líneas, textos secundarios y
variantes RGB para transparencias. Todos los textos principales superan el contraste
AA sobre sus fondos.

### Tres paquetes tipográficos

| Paquete | Nombre                   | Titulares           | Textos            | Perfil                            |
| ------- | ------------------------ | ------------------- | ----------------- | --------------------------------- |
| A       | Editorial contemporánea  | Newsreader 500–600  | Inter 400         | Prensa, documentos, editorial     |
| B       | Humanista cercana        | Fraunces 400–600    | Source Sans 3 400 | Comunidad, cercanía, redes        |
| C       | Prensa moderna           | Archivo 600–700     | Source Serif 4    | Medios, datos, autoridad          |

Las seis familias se cargan desde Google Fonts en `index.html` y `diseno.html` para
permitir la previsualización. Cuando elijas una combinación definitiva, puedes
recortar el enlace `fonts.googleapis.com` y borrar los bloques `[data-fonts]` que no
uses para aligerar la carga.

---

## Accesibilidad y calidad

- HTML semántico con un solo `h1` y jerarquía de encabezados sin saltos.
- Enlace «Saltar al contenido», foco visible y navegación con teclado.
- Formulario con etiquetas explícitas, `aria-invalid`, mensajes asociados por
  `aria-describedby`, resumen de estado `role="status"` y foco al primer error.
- Botón de WhatsApp con `aria-label`; menú móvil con `aria-expanded` y cierre con
  `Esc`.
- Fotografías con texto alternativo y bloques de color descriptivos para lectores de
  pantalla.
- Contraste AA verificado en las tres paletas; tipografías de respaldo si falla la
  red.
- Diseño responsive comprobado entre 360 px y 1440 px de ancho.
- Sin dependencias externas de JavaScript; solo las fuentes de Google.

---

## Antes de publicar

- [ ] Confirmar cargos y reemplazar los textos Lorem ipsum y las candidaturas referenciales.
- [ ] Cambiar correo, WhatsApp, dirección y horario.
- [ ] Revisar la autorización de las fotografías, incluida la de Pamela Hidalgo.
- [ ] Conectar el formulario a un servicio de envío y borrar el aviso de demo.
- [ ] Elegir la paleta y el paquete tipográfico definitivos.
- [ ] Quitar la barra de demostración y ajustar el pie de página.
- [ ] Revisar enlaces sociales o documentos que se agreguen.
