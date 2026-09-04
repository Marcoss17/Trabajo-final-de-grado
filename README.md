# FutTrain

FutTrain es una plataforma web de entrenamiento orientada a futbolistas, desarrollada como proyecto de Trabajo de Fin de Grado (TFG).

La aplicación permite a los usuarios registrarse, seleccionar planes de entrenamiento, consultar rutinas, realizar un seguimiento de sus entrenamientos y visualizar su progreso mediante estadísticas y calendario.

El proyecto está compuesto por un frontend desarrollado con Nuxt y Vue y un backend desarrollado con Node.js y Express, utilizando MongoDB como base de datos.

---

## Objetivos

El objetivo principal de FutTrain es ofrecer una plataforma que facilite la planificación y seguimiento del entrenamiento físico de futbolistas.

Entre los objetivos del proyecto se encuentran:

* Facilitar el acceso a diferentes planes de entrenamiento.
* Permitir a cada usuario gestionar sus rutinas.
* Registrar el progreso de los entrenamientos realizados.
* Proporcionar estadísticas sobre la evolución del usuario.
* Gestionar perfiles y datos personales.
* Implementar un sistema de autenticación y protección de rutas.
* Crear una interfaz web responsive y sencilla de utilizar.

---

## Funcionalidades

### Gestión de usuarios

* Registro de nuevos usuarios.
* Inicio de sesión.
* Autenticación mediante **JWT**.
* Protección de rutas mediante middleware.
* Edición de datos personales.
* Cambio de contraseña.
* Subida y actualización de fotografía de perfil.

### Planes y rutinas

La aplicación dispone de diferentes niveles de entrenamiento:

* Plan Básico
* Plan Intermedio
* Plan Premium

Cada plan incluye diferentes rutinas organizadas por objetivos y días de entrenamiento.

Las rutinas contienen información sobre:

* Ejercicios.
* Series.
* Repeticiones.
* Descripción.
* Vídeos explicativos.

### Seguimiento del progreso

Los usuarios pueden realizar un seguimiento de las rutinas completadas.

El sistema permite:

* Marcar días de entrenamiento como completados.
* Consultar el progreso de cada rutina.
* Visualizar porcentajes de progreso.
* Consultar el entrenamiento mediante un calendario.
* Eliminar rutinas y sus progresos asociados.

### Configuración del perfil

Desde el panel de usuario es posible:

* Consultar la información personal.
* Modificar nombre y correo electrónico.
* Cambiar la contraseña.
* Gestionar la fotografía de perfil.
* Gestionar el plan seleccionado.

---

## Tecnologías utilizadas

### Frontend

* Vue 3
* Nuxt 3
* JavaScript / TypeScript
* Tailwind CSS
* Pinia
* Axios
* Chart.js
* Vue Chart.js
* V-Calendar
* Vue Toastification
* VueUse Motion

### Backend

* Node.js
* Express 5
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* bcryptjs
* Multer
* CORS
* dotenv

---

## Arquitectura

El proyecto está dividido en dos partes principales:

```text
FutTrain/
│
├── frontend/
│   ├── components/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   ├── plugins/
│   ├── public/
│   ├── server/
│   ├── stores/
│   ├── utils/
│   └── data/
│
├── backend/
│   ├── config/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── index.js
│
└── README.md
```

### Frontend

El frontend está desarrollado con Nuxt 3 y Vue 3.

La aplicación utiliza una arquitectura basada en páginas y componentes, con:

* Gestión de estado mediante Pinia.
* Middleware para controlar el acceso a determinadas páginas.
* Axios para las comunicaciones con la API.
* Tailwind CSS para el diseño de la interfaz.
* Chart.js para la representación de estadísticas.
* V-Calendar para la visualización del progreso mediante calendario.

### Backend

El backend está desarrollado con Node.js y Express.

La API se organiza mediante diferentes rutas:

```text
/api/auth
/api/usuario
/api/usuario/rutinas
/api/progreso
```

El acceso a determinadas operaciones se protege mediante autenticación JWT.

La información de los usuarios, rutinas seleccionadas y progreso se gestiona mediante MongoDB y Mongoose.

---

## Autenticación y seguridad

FutTrain incorpora un sistema de autenticación basado en JSON Web Tokens (JWT).

Las contraseñas de los usuarios se almacenan utilizando bcryptjs, evitando guardar las contraseñas directamente en texto plano en la base de datos principal.

Las rutas que requieren autenticación utilizan un middleware encargado de verificar el token enviado mediante la cabecera:

```text
Authorization: Bearer <token>
```

Las variables sensibles de configuración se gestionan mediante variables de entorno.

---

## Instalación

### Requisitos

Para ejecutar el proyecto localmente es necesario disponer de:

* Node.js
* npm
* MongoDB
* Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/FutTrain.git
cd FutTrain
```

### 2. Configurar el backend

Entrar en la carpeta:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` dentro de `backend/` con las variables necesarias:

```env
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta
PORT=5000
```

### 3. Iniciar el backend

Desde `backend/`:

```bash
npm run dev
```

El servidor se ejecutará por defecto en:

```text
http://localhost:5000
```

### 4. Configurar el frontend

Abrir otra terminal y entrar en:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

La configuración actual utiliza el backend local:

```text
http://localhost:5000/api
```

### 5. Iniciar el frontend

```bash
npm run dev
```

Nuxt proporcionará la dirección local para acceder a la aplicación.

---

## Estructura principal del backend

```text
backend/
├── config/
│   └── db.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── Progreso.js
│   ├── UserRutinas.js
│   └── Usuario.js
├── routes/
│   ├── auth.js
│   ├── progreso.js
│   ├── userRutinas.js
│   └── usuario.js
├── index.js
├── package.json
└── package-lock.json
```

---

## 📱 Estructura principal del frontend

```text
frontend/
├── components/
├── layouts/
├── middleware/
├── pages/
│   ├── auth/
│   ├── plan/
│   └── paneles/
├── plugins/
├── public/
├── server/
├── stores/
├── utils/
├── data/
├── nuxt.config.ts
├── package.json
└── package-lock.json
```

---

## Gestión del progreso

El progreso de los usuarios se almacena en MongoDB y se relaciona con las rutinas seleccionadas.

Cada rutina puede registrar los días completados, permitiendo calcular el porcentaje de progreso y representarlo visualmente dentro del panel del usuario.

---

## Documentación

La memoria completa del Trabajo de Fin de Grado se encuentra disponible en el repositorio dentro de la carpeta `docs`.

```text
docs/
└── Memoria_TFG.pdf
```

---

## Trabajo de Fin de Grado

Proyecto: FutTrain
Tipo: Trabajo de Fin de Grado (TFG)

El proyecto aborda el diseño y desarrollo de una plataforma web de entrenamiento deportivo, cubriendo tanto el desarrollo frontend como backend, gestión de usuarios, persistencia de datos, autenticación y seguimiento del progreso.

---

## Autor

Marcos

Proyecto desarrollado como parte del Trabajo de Fin de Grado.

---

## Estado del proyecto

Proyecto académico finalizado.
