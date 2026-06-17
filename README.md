# Inventario Componentes - Frontend Client

Esta es la interfaz de usuario para el sistema de gestión de inventario de hardware. Una Single Page Application (SPA) responsiva, rápida y diseñada con una estética moderna en modo oscuro.

## 🛠️ Tecnologías y Características

* **React 18 & Vite**: Configuración optimizada utilizando el empaquetador de alto rendimiento Vite y gestión de paquetes ágil.
* **Tailwind CSS**: Estilos limpios y adaptables a entornos responsivos.
* **Formularios Híbridos Dinámicos**: Componente de autenticación inteligente que gestiona lógicamente los flujos de *Login* y *Registro de Administradores*.
* **Seguridad (JWT Integration)**: Persistencia del token de sesión en `localStorage` y manejo automatizado del estado de autenticación.
* **Consumo de API**: Conexión directa a endpoints asíncronos protegidos mediante cabeceras de autorización HTTP.

## 🚀 Cómo Ejecutar Localmente

1. **Instalar Dependencias**:
   Asegúrate de estar dentro de la carpeta `inventario-frontend` y ejecuta:
```bash
   pnpm install
   ```
(O usa npm install si no tienes pnpm configurado).

2. **Levantar Servidor de Desarrollo**:\
Bash\
pnpm dev

Acceder a la Aplicación:
Abre tu navegador en: http://localhost:5173