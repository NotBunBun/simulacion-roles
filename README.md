# 📦 Gestión de Tipos y Propiedades

**Next.js • React • Material UI • TypeScript**

Una interfaz responsiva y moderna para administrar dos entidades principales: **Tipos** y **Propiedades**, con control de acceso por roles (admin/viewer) y persistencia en archivos JSON mediante rutas API de Next.js.

---
## 📑 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación)
- [Scripts disponibles](#-scripts-disponibles)
- [Arquitectura](#-arquitectura)
- [Contextos](#-contextos)
- [API Routes](#-api-routes)
- [Temas y Diseño](#-temas-y-diseño)
- [Mejoras Futuras](#-mejoras-futuras)
- [Licencia](#-licencia)

---
## 🎯 Características

- **CRUD completo** de Tipos y Propiedades (Create / Read / Update / Delete)
- **Buscador con debounce** (400 ms) para optimizar la experiencia del usuario
- **Drawer forms** para creación y edición sin recargar la página
- **Control de acceso** por roles (**admin** ve todos los botones; **viewer** solo puede leer)
- **Persistencia local** en JSON a través de rutas API de Next.js
- **Diseño elegante** con tema oscuro y acentos púrpura, adaptado a móviles

---

## 🛠 Instalación

```bash
# Clonar repositorio
git clone https://github.com/NotBunBun/prueba-.git
cd prueba-
# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev         # http://localhost:3000
```

> Si hay conflictos de **peer dependencies**, prueba:
> ```bash
> npm install --legacy-peer-deps
> ```

---
## 📋 Scripts disponibles

| Comando          | Descripción                                         |
| ---------------- | --------------------------------------------------- |
| `yarn dev`       | Levanta el servidor de desarrollo                   |
| `yarn build`     | Genera la app para producción                       |
| `yarn start`     | Arranca la app en modo producción                   |
| `yarn lint`      | Ejecuta ESLint para revisar estilo y errores comunes |
| `yarn test`      | Ejecuta tests (por implementar)                     |

---
## 🏗 Arquitectura

```
src/
├─ app/
│  ├─ components/       # UI genéricos (Drawers, Tablas, Layout)
│  ├─ context/          # AuthContext & DataContext
│  └─ theme/            # Configuración de Material UI
pages/
├─ api/
│  ├─ tipos/           # CRUD JSON en data/tipos.json
│  └─ propiedades/     # CRUD JSON en data/propiedades.json
└─ tipos/              # Páginas de gestión de Tipos
└─ propiedades/        # Páginas de gestión de Propiedades
/public/
└─ background.png     # Imagen de fondo principal
/data/
├─ tipos.json
└─ propiedades.json
```

---
## 🔑 Contextos

- **AuthContext**: controla el usuario simulado (roles `admin` | `viewer`).
- **DataContext**: sincroniza estado con `/api/...` para Tipos y Propiedades.

---
## 🔌 API Routes

- **`GET  /api/tipos`** → Listar todos los tipos
- **`POST /api/tipos`** → Crear un nuevo tipo
- **`GET  /api/tipos/[id]`** → Obtener tipo por ID
- **`PUT  /api/tipos/[id]`** → Actualizar un tipo existente
- **`DELETE /api/tipos/[id]`** → Eliminar un tipo

Análogo para **`/api/propiedades`**.

---
## 🎨 Temas y Diseño

- **Paleta**: fondo `#0a0a0a`, overlay `#0e0220`, acento `#6e00cc`–`#b55eff`.
- **Tipografía**: `Playfair Display` para títulos, `Roboto` para cuerpo.
- **Responsive**: breakpoints móviles, tablet y escritorio.
- **Microinteracciones**: hover con **scale(1.02)** y **glow**.

---
## 🛠 Mejoras Futuras

- Integración con un **backend real** (REST o GraphQL)
- Indicadores de **carga** (spinners, skeletons)
- Validaciones avanzadas y manejo de errores en formularios
- **Tests** unitarios e integración (Jest, React Testing Library)
- Mejorar accesibilidad (WCAG)

