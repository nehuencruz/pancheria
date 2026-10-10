# El Mejor Pancho de San Fernando — Landing page

Landing page estática (HTML + CSS + JS, sin build) para **El Mejor Pancho de San Fernando**.

## Ver en local

Abrí `index.html` en el navegador, o levantá un servidor simple:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Publicar gratis con GitHub Pages

Settings → Pages → *Deploy from a branch* → elegí la rama y la carpeta `/ (root)`.

## Qué incluye

- Preloader animado, cursor personalizado, botones magnéticos y tarjetas con efecto 3D.
- Scroll suave (Lenis) y animaciones con GSAP + ScrollTrigger.
- Sección "Los de la casa" con scroll horizontal fijado (en celular se desliza con el dedo).
- Historia de la panchería: desde 2004, atendida por Joaquín y Jorge.
- Menú por pestañas (Panchos, Salsas, Bebidas, Cervezas) con una ilustración que cambia según el producto.
- Horarios **lunes a sábados de 11 a 22 hs** con estado *Abierto/Cerrado* en vivo (hora Argentina) y cuenta regresiva.
- Diseño responsive, respeta `prefers-reduced-motion` y funciona aunque no carguen las animaciones.

## Cómo editar

| Qué | Dónde |
| --- | --- |
| Productos, descripciones y **precios** | `script.js` → constante `MENU` (arriba de todo) |
| Tarjetas de "Los de la casa" | `script.js` → constante `FEATURED` |
| Chips de salsas | `script.js` → constante `SAUCES` |
| Horario | `script.js` → `OPEN_MIN` / `CLOSE_MIN` y la tabla en `index.html` (`#hoursList`) |
| Colores y fuentes | `styles.css` → variables en `:root` |
| WhatsApp, dirección, redes | `index.html` → buscar `TODO` |

> Los productos sin precio (cervezas y Cunnington Tónica) se muestran como "Consultar". Para ponerles precio, agregá `price: 1234` en `MENU`.

## Estructura

```
index.html
styles.css
script.js
assets/
  logo.webp, logo.png, favicon.png
  fonts/    (Bowlby One, Archivo, Permanent Marker — licencia OFL)
  vendor/   (GSAP 3.12.5, ScrollTrigger, Lenis 1.1.13)
```
