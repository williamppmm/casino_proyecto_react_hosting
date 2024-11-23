# 🚀 Estructura del Proyecto Casino la Fortuna

## 📁 Estructura Raíz

```plaintext
📦 PROYECTO
 ┣ 📄 .gitignore
 ┣ 📄 README.md
 ┣ 📂 docs
 ┣ 📂 FRONTEND
 ┗ 📂 BACKEND
```

## 📁 Frontend

```plaintext
📦 FRONTEND
 ┣ 📄 .env
 ┣ 📄 .env.development
 ┣ 📄 package-lock.json
 ┣ 📄 package.json
 ┣ 📂 public
 ┃ ┗ 📄 manifest.json
 ┗ 📂 src
   ┣ 📂 assets
   ┃ ┣ 📂 icons
   ┃ ┣ 📂 images
   ┃ ┗ 📂 logos
   ┣ 📂 components
   ┃ ┣ 📂 common
   ┃ ┣ 📂 forms
   ┃ ┣ 📂 layout
   ┃ ┗ 📂 profile
   ┣ 📂 hooks
   ┣ 📂 pages
   ┃ ┣ 📂 dashboard
   ┃ ┣ 📂 home
   ┃ ┣ 📂 login
   ┃ ┗ 📂 register
   ┣ 📂 services
   ┣ 📂 styles
   ┗ 📂 utils
```

### 📝 Descripción de Carpetas Frontend

| Carpeta | Descripción |
|---------|-------------|
| `assets` | Recursos estáticos como imágenes, iconos y logos |
| `components` | Componentes React reutilizables organizados por categoría |
| `hooks` | Custom hooks de React |
| `pages` | Componentes de página completa y rutas principales |
| `services` | Servicios para comunicación con APIs y lógica de negocio |
| `styles` | Archivos de estilo globales y configuraciones |
| `utils` | Funciones y utilidades compartidas |

## 📁 Backend

```plaintext
📦 BACKEND
 ┣ 📄 .env
 ┣ 📄 .env.development
 ┣ 📂 config
 ┣ 📂 controllers
 ┣ 📂 middlewares
 ┣ 📂 models
 ┣ 📄 package-lock.json
 ┣ 📄 package.json
 ┣ 📂 routes
 ┗ 📂 utils
```

### 📝 Descripción de Carpetas Backend

| Carpeta | Descripción |
|---------|-------------|
| `config` | Configuraciones de la aplicación y variables de entorno |
| `controllers` | Controladores que manejan la lógica de negocio |
| `middlewares` | Funciones intermedias para procesar requests |
| `models` | Modelos de datos y esquemas |
| `routes` | Definición de rutas y endpoints de la API |
| `utils` | Funciones utilitarias y helpers |

### 📝 Archivos y Carpetas en la Raíz

| Archivo/Carpeta | Descripción |
|---------|-------------|
| `.gitignore` | Especifica qué archivos y carpetas deben ser ignorados por Git |
| `README.md` | Documentación principal del proyecto, incluye descripción, instrucciones de instalación y uso |
| `docs` | Documentación adicional del proyecto, guías técnicas, diagramas y otros recursos de documentación |

---

> 💡 **Nota**: Esta estructura sigue las mejores prácticas de organización para aplicaciones full stack, separando claramente las responsabilidades entre frontend y backend, y manteniendo la documentación organizada.
