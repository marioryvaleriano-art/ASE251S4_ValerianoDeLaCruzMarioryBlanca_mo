🍷 App Móvil Almacén — Bodega Peirano
Aplicación móvil desarrollada con React Native y Expo para la gestión de almacenes de la Bodega Peirano. Permite administrar ubicaciones, stock y datos de inventario desde un dispositivo móvil, con una interfaz optimizada para uso en campo.

React NativeExpoJavaScriptGitLicense Academic

📋 Tabla de Contenidos
Descripción General
Características
Tecnologías
Estructura del Proyecto
Instalación
Configuración
Ejecución
Credenciales de Prueba
Autor
📖 Descripción General
La App Móvil Almacén es una aplicación desarrollada con React Native y Expo que permite a los usuarios de la Bodega Peirano gestionar los almacenes, ubicaciones y stock de productos desde un dispositivo móvil. Su interfaz está optimizada para uso en campo, facilitando el control del inventario en tiempo real.

📱 Características
Login de acceso — Autenticación de usuarios para ingresar al sistema.

Dashboard — Resumen general del estado de los almacenes y stock.

CRUD Maestro de Almacenes — Crear, listar, editar y eliminar registros de almacenes.

Gestión de inventario — Control de ubicaciones y stock de productos.

Diseño móvil — Listas y formularios optimizados para pantallas táctiles.

🛠️ Tecnologías
Tecnología	Uso
React Native	Framework de desarrollo móvil
Expo	Herramientas y entorno de desarrollo
JavaScript / TypeScript	Lenguaje de programación
Git & GitHub	Control de versiones
📁 Estructura del Proyecto
App-movil-almacen/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── screens/         # Pantallas (Login, Dashboard, Almacenes...)
│   ├── services/        # Llamadas a la API
│   ├── models/          # Modelos de datos
│   └── utils/           # Utilidades y helpers
├── App.js               # Componente raíz
├── package.json         # Dependencias
└── README.md
Copiar
🚀 Instalación
Requisitos previos
Node.js (versión 16 o superior)
Expo CLI
Un emulador Android/iOS o el dispositivo físico con la app Expo Go
Pasos
git clone https://github.com/marioryvaleriano-art/ASE251S4_ValerianoDeLaCruzMarioryBlanca_mo.git
cd App-movil-almacen
npm install
Copiar
⚙️ Configuración
Crear un archivo .env en la raíz del proyecto con las variables de entorno necesarias (URL de la API backend, etc.).
Asegurarse de que el backend de la Bodega Peirano esté corriendo y accesible desde el dispositivo o emulador.
▶️ Ejecución
npx expo start
Copiar
Presiona a para abrir en un emulador Android.
O escanea el código QR con la app Expo Go en tu dispositivo físico.
🔑 Credenciales de Prueba
Rol	Correo	Contraseña
Administrador	admin@peirano.com	admin123
Usuario	usuario@peirano.com	usuario123
👤 Autor
Proyecto académico desarrollado para el Instituto de Educación Superior Tecnológico Valle Grande.
