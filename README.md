# Pet Adoption Frontend - Perdidos y Adopciones

Plataforma web para gestión de publicaciones de animales perdidos, encontrados y en adopción en Tucumán, Argentina.

## Descripción

Sistema frontend desarrollado en React que permite a los usuarios:
- Publicar animales perdidos, encontrados o en adopción
- Buscar y filtrar publicaciones
- Gestionar casos comunitarios
- Administrar publicaciones y usuarios (rol admin)

## Stack Tecnológico

- React 19.2.3 - Framework UI
- Vite 7.1.2 - Build tool y dev server
- React Router 7.9.3 - Navegación SPA
- Tailwind CSS 4.1.13 - Estilos y diseño
- Framer Motion 12.23.22 - Animaciones
- Axios 1.6.0 - Cliente HTTP con interceptores
- React Lazy Load Image Component 1.6.0 - Optimización de imágenes
- ESLint 9.33.0 - Linting

## Instalación

```bash
# Clonar repositorio
git clone [URL_DEL_REPO]

# Instalar dependencias
npm install

# Crear archivo .env con las variables necesarias
# Ver .env.example para referencia

# Iniciar servidor de desarrollo
npm run dev
```

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 5173)
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables (15)
│   ├── CrearPublicacion/  # Formulario de publicaciones (refactorizado)
│   ├── Navbar/            # Barra de navegación
│   ├── Footer/            # Pie de página
│   └── ...
├── pages/           # Páginas principales (9)
│   ├── HomeScreen/
│   ├── LoginScreen/
│   └── ...
├── services/        # Servicios API (7)
│   ├── auth.js
│   ├── publicaciones.js
│   └── ...
├── context/         # Contextos React
├── hooks/          # Custom hooks
└── routes/         # Configuración de rutas
```

## Mejoras Recientes (Alta Prioridad)

### 1. Optimización de Console.logs
- Configurado Vite con Terser para remover console.log en producción
- Los logs se mantienen en desarrollo para debugging

### 2. Optimización de Fetching
- Antes: HomeScreen hacía aproximadamente 100 requests para obtener contadores
- Ahora: Solo 3 requests usando el campo total de la API
- Mejora: Aproximadamente 97% de reducción de requests

### 3. Refactorización de CrearPublicacion
- Antes: 1 archivo de 1006 líneas
- Ahora: 9 archivos modulares
  - CrearPublicacion.jsx (250 líneas) - Componente principal
  - usePublicacionForm.js - Hook de formulario
  - FormValidation.js - Lógica de validación
  - useImageUpload.js - Hook de subida de imágenes
  - FormFields.jsx - Campos reutilizables
  - CommonFields.jsx - Campos comunes
  - AdopcionFields.jsx - Campos de adopción
  - PerdidoEncontradoFields.jsx - Campos perdido/encontrado
  - CrearPublicacion.backup.jsx - Backup del original

Beneficios:
- Mejor mantenibilidad
- Código más legible
- Reutilización de componentes
- Separación de responsabilidades

### 4. Sistema de Refresh Token
- Implementación completa de renovación automática de tokens
- Interceptor de axios maneja expiración de tokens (401)
- Cola de requests evita múltiples refreshes simultáneos
- Logout integrado revoca tokens en backend
- Ver REFRESH_TOKEN_IMPLEMENTATION.md para detalles

### 5. Lazy Loading de Imágenes
- react-lazy-load-image-component instalado
- CardGenerica: 2 imágenes optimizadas
- CardsAyuda: Imagen optimizada
- Efecto blur mientras carga
- Placeholders SVG ligeros
- Beneficio: Mejora significativa en tiempo de carga inicial

## Seguridad

- Variables de entorno en .env (no trackeado en git)
- Autenticación JWT
- Validación de formularios
- Headers seguros en peticiones API

## Métricas del Proyecto

- Archivos: 47
- Componentes JSX: 42 (con refactorización)
- Tamaño: Aproximadamente 288 KB
- Bundle size: Aproximadamente 508 KB (compilado)
- Errores ESLint: 0

## Deployment

El proyecto está configurado para deployment en Vercel:
- Build automático en push a main
- Variables de entorno configuradas en panel de Vercel
- SPA routing configurado en vercel.json

## Variables de Entorno Requeridas

```env
VITE_API_URL=                    # URL del backend API
VITE_API_SEED_TOKEN=             # Token de seed
VITE_ACCESS_KEY=                 # Access key
VITE_HOME_IMG_URL=               # URL imagen portada
VITE_HOME_COLAB_IMG_URL=         # URL imagen colaboración
VITE_WHATDO_IMG_URL=             # URL imagen ¿Qué hacer?
VITE_FAVICON_URL=                # URL favicon
VITE_NAVBAR_LOGO_URL=            # URL logo navbar
VITE_FOOTER_IMG_URL=             # URL imagen footer
VITE_CONTACT_IMG_URL=            # URL imagen contacto
VITE_MEDIA_IMG_URL=              # URL imagen media
VITE_CASOS_IMG_URL=              # URL imagen casos
VITE_ACCESS_IMG_URL=             # URL imagen acceso
```

## Contribución

El proyecto sigue testing manual. Para contribuir:
1. Fork del repositorio
2. Crear branch de feature
3. Testear manualmente cambios
4. Pull request con descripción detallada

## Licencia

[Especificar licencia]

## Autor

[Tu nombre/equipo]

---

Última actualización: Enero 2026
