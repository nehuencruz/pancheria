# El Mejor Pancho de San Fernando — Web + panel del dueño

Sitio estático (HTML + CSS + JS, sin build) con:

- **Página principal** (`/`): menú, horarios en vivo, historia, "Los de la casa".
- **Eventos** (`/eventos/`): eventos con fotos y descripciones.
- **Panel del dueño** (`/admin/`): para editar productos, precios, fotos y eventos.
- **Supabase**: login del dueño, base de datos y fotos.

Los productos y eventos se leen de Supabase. Si Supabase no está configurado o no responde, la página principal muestra el menú de respaldo que está en `script.js` y nunca queda vacía.

---

## Seguridad: cómo funciona

- La web y el panel usan **solo la clave pública** de Supabase (*anon* / *publishable*). Está pensada para estar en el navegador.
- Lo que impide que alguien modifique datos son las **políticas RLS** de la base (`supabase/schema.sql`):
  - Cualquiera puede **leer** productos y eventos **activos**.
  - Solo un usuario que está en la tabla `admins` puede **crear, modificar o borrar** productos, eventos y fotos.
  - La tabla `admins` no se puede leer ni modificar desde la web.
- El registro público queda **desactivado**: el usuario del dueño se crea a mano.
- La clave secreta (`service_role` / `sb_secret_…`) **no se usa en ningún lado**. Si alguien la configura por error, la publicación y el panel se niegan a funcionar.
- Los textos que vienen de la base se muestran escapados, así que no se puede inyectar código.
- Las fotos se achican en el navegador (máx. 1600 px, WEBP) antes de subirse. Supabase además limita el bucket a 5 MB y a imágenes JPG, PNG o WEBP.

---

## Puesta en marcha (una sola vez)

### 1. Crear el proyecto en Supabase

1. Entrá a <https://supabase.com>, creá una cuenta y un **New project**. Anotá la contraseña de la base en un lugar seguro: no hace falta pasársela a nadie.
2. Abrí **SQL Editor → New query**, pegá todo el contenido de [`supabase/schema.sql`](supabase/schema.sql) y tocá **Run**.
3. Hacé lo mismo con [`supabase/seed.sql`](supabase/seed.sql). Carga el menú actual completo.

### 2. Cerrar el registro y crear el usuario del dueño

1. **Authentication → Sign In / Providers**: desactivá **"Allow new users to sign up"**. El proveedor *Email* queda activo.
2. **Authentication → Users → Add user → Create new user**: email y contraseña del dueño. Marcá **Auto Confirm User**.
3. Abrí [`supabase/make-admin.sql`](supabase/make-admin.sql), reemplazá `EMAIL_DEL_DUENO@ejemplo.com` por ese email y ejecutalo en el SQL Editor. Al final tiene que aparecer el email en el resultado.

### 3. Conectar la web (variables de entorno)

En Supabase, **Project Settings → API** (o **API Keys**), copiá:

- **Project URL**, por ejemplo `https://abcd1234.supabase.co`.
- La clave **anon / public** o **publishable** (`sb_publishable_…`). **No** la `service_role` ni la `secret`.

En GitHub: **Settings → Secrets and variables → Actions → pestaña Variables → New repository variable**:

| Nombre | Valor |
| --- | --- |
| `SUPABASE_URL` | el Project URL |
| `SUPABASE_ANON_KEY` | la clave pública |

### 4. Publicar con GitHub Pages

**Settings → Pages → Build and deployment → Source: GitHub Actions**.

Cada vez que se suben cambios, el workflow `.github/workflows/deploy.yml` genera `config.js` con esas variables y publica el sitio. También se puede correr a mano desde la pestaña **Actions → Publicar en GitHub Pages → Run workflow**.

- Web: `https://nehuencruz.github.io/pancheria/`
- Panel: `https://nehuencruz.github.io/pancheria/admin/`

---

## Uso del panel (`/admin/`)

**Productos:**
- Agregar, editar o eliminar.
- Cambiar nombre, categoría, descripción y etiqueta.
- Precio: único, efectivo + transferencia, o sin precio ("Consultar").
- Foto: reemplaza al dibujo en la web.
- Orden, "Destacado" (aparece en *Los de la casa*) y "Visible en la web".

**Eventos:**
- Título, fecha, descripción y visible u oculto.
- Después de guardar el evento, se suben las fotos (varias a la vez). Cada foto tiene su descripción, se puede reordenar y eliminar.

Los cambios aparecen en la web pública al recargar la página.

> Para sacar un producto un tiempo, conviene **ocultarlo** (interruptor "Visible") en vez de eliminarlo.

---

## Ver en local

```bash
cp .env.example .env              # completar SUPABASE_URL y SUPABASE_ANON_KEY
node scripts/make-config.mjs      # genera config.js (no se sube a GitHub)
python3 -m http.server 8000       # http://localhost:8000
```

Sin `config.js` la web funciona igual con el menú de respaldo, y el panel avisa que falta configurar.

---

## Estructura

```
index.html, styles.css, script.js     Página principal
eventos/index.html                    Página de eventos
admin/index.html, admin.css, admin.js Panel del dueño
assets/
  js/data.js        Lectura pública de Supabase (sin librerías)
  js/eventos.js     Página de eventos
  css/eventos.css   Estilos propios de eventos
  vendor/           GSAP, ScrollTrigger, Lenis, supabase-js (solo en /admin)
  fonts/, logo…
supabase/
  schema.sql        Tablas, permisos (RLS) y bucket de fotos
  seed.sql          Menú inicial
  make-admin.sql    Convertir al dueño en administrador
scripts/make-config.mjs   Genera config.js desde variables de entorno
.github/workflows/deploy.yml  Publicación en GitHub Pages
```

| Qué editar | Dónde |
| --- | --- |
| Productos, precios, fotos, eventos | Panel `/admin/` |
| Menú de respaldo (si Supabase no responde) | `script.js` → `FALLBACK_MENU` |
| Horario | `script.js` → `OPEN_MIN` / `CLOSE_MIN` y la tabla en `index.html` (`#hoursList`) |
| Colores y fuentes | `styles.css` → variables en `:root` |
| Dirección y redes | `index.html` → buscar `TODO` |
