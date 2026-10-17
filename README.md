# CV y portafolio personal

Portafolio web de Leandro Lahore, desarrollado como examen práctico de Tecnologías Web I (SIS-214) de la Universidad Católica Boliviana “San Pablo”.

## Enlaces de entrega

- **Repositorio público:** <https://github.com/leandrolahore2006/SIS214_ExamenPractico2_LahoreLeandro>
- **Sitio en GitHub Pages:** <https://leandrolahore2006.github.io/SIS214_ExamenPractico2_LahoreLeandro/>
- **Perfil de GitHub:** <https://github.com/leandrolahore2006>

## Arquitectura

El proyecto es una aplicación estática, sin dependencias ni proceso de compilación:

| Archivo o carpeta | Propósito |
| --- | --- |
| `index.html` | Contenido semántico del CV, proyectos, repositorios, multimedia y formulario accesible. |
| `css/styles.css` | Punto de entrada que carga los módulos de estilos en el orden necesario para conservar la cascada. |
| `css/variable/` | Colores, tipografía, espaciado y demás tokens del diseño. |
| `css/base/` | Reset universal y estilos globales básicos. |
| `css/layout/` | Estructura principal, composición de secciones y reglas responsivas. |
| `css/componentes/` | Estilos base de controles y componentes de la interfaz. |
| `css/estilo/` | Tema editorial y ajustes visuales del portafolio. |
| `js/app.js` | Interacciones, validación del formulario, persistencia del tema y consulta asíncrona a GitHub. |
| `assets/images/` | Fotografía de perfil e imágenes de proyectos. |
| `assets/audio/` | Presentaciones personal y del proyecto. |
| `assets/video/` | Video de presentación del proyecto. |
| `.github/workflows/deploy-pages.yml` | Publicación automática en GitHub Pages al actualizar la rama `main`. |

### Patrones de software

- **Programación funcional e inmutabilidad:** el buscador usa `.filter()` y `.map()` para construir una nueva colección de proyectos sin alterar los datos originales.
- **Asincronía controlada:** la consulta REST de GitHub usa `async/await`, valida la respuesta HTTP y representa los estados de carga, éxito y error.
- **Persistencia local:** el tema se serializa como JSON en `localStorage` y se restaura al cargar la página.
- **Separación de responsabilidades:** HTML, estilos modulares y lógica JavaScript se organizan en sus respectivas carpetas.

## Funcionalidades

- Alterna entre temas claro y oscuro; guarda y restaura la preferencia en `localStorage` como JSON.
- Abre y cierra la navegación móvil y de tablet con estado accesible `aria-expanded`.
- Filtra proyectos mientras se escribe sin modificar la colección original.
- Valida nombre, correo y mensaje durante la interacción y al enviar el formulario. Es una demostración local: no envía ni almacena mensajes.
- Consulta hasta seis repositorios públicos de `leandrolahore2006` mediante la API de GitHub y muestra los estados de carga, éxito y error.
- Incluye recursos de imagen, audio y video para el perfil y el proyecto hospitalario.
- Presenta un estado vacío al no encontrar proyectos, y una notificación temporal cuando se valida correctamente el formulario.

## Accesibilidad (WAI-ARIA)

- Estructura semántica con `header`, `nav`, `main`, `section`, `article`, `aside` y `footer`.
- El menú móvil sincroniza `aria-expanded` y `aria-controls`; el conmutador de tema actualiza `aria-pressed` y su etiqueta accesible.
- Los campos del formulario enlazan sus errores con `aria-describedby` y comunican su validez mediante `aria-invalid`.
- Los cambios del buscador, la validación, la notificación y la consulta a GitHub se comunican mediante regiones `aria-live="polite"` y estados `role="status"`.
- Se incluyen texto alternativo para imágenes, navegación por teclado, foco visible y un enlace para saltar al contenido.

## Ejecución local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/leandrolahore2006/SIS214_ExamenPractico2_LahoreLeandro.git
   cd SIS214_ExamenPractico2_LahoreLeandro
   ```

2. Abre la carpeta en Visual Studio Code y ejecuta `index.html` con una extensión de servidor local, como Live Server.
3. Usa una conexión a Internet para que se puedan consultar los repositorios de GitHub.

La página no necesita `npm install` ni compilación. Usa una conexión a Internet para consultar los repositorios públicos de GitHub.

## Publicación en GitHub Pages

El flujo [deploy-pages.yml](.github/workflows/deploy-pages.yml) publica el sitio cuando se actualiza `main`.

1. El repositorio público se llama `SIS214_ExamenPractico2_LahoreLeandro`.
2. Desde esta carpeta, configura el remoto y publica la rama (ya configurado para este proyecto):

   ```bash
   git remote add origin https://github.com/leandrolahore2006/SIS214_ExamenPractico2_LahoreLeandro.git
   git push -u origin main
   ```

3. En **Settings → Pages**, selecciona **GitHub Actions** como fuente de publicación (ya configurado).
4. Espera a que finalice el flujo de trabajo **Deploy to GitHub Pages**. El sitio estará disponible en el enlace indicado arriba.

El formulario de contacto es una demostración: valida los campos y muestra una notificación, pero no envía ni almacena mensajes. Para recibirlos se necesita integrar y configurar un backend o un servicio de formularios.
