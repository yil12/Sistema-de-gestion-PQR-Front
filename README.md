# Sistema de Gestión de PQR — Frontend

Aplicación web para la gestión de Peticiones, Quejas y Reclamos (PQR) de la Fundación Sersocial IPS.

El frontend permite a los ciudadanos registrar y consultar sus PQR, y proporciona a los agentes internos una interfaz para consultar, filtrar y gestionar las solicitudes, actualizar estados y registrar seguimientos.

El proyecto está desarrollado con React y Vite, utilizando Axios para la comunicación con la API REST y Docker + Nginx para facilitar la ejecución y despliegue de la aplicación.

---

## Tabla de contenidos

* [Descripción](#descripción)
* [Funcionalidades](#funcionalidades)
* [Stack tecnológico](#stack-tecnológico)
* [Requisitos](#requisitos)
* [Arquitectura](#arquitectura)
* [Configuración](#configuración)
* [Inicio rápido con Docker](#inicio-rápido-con-docker)
* [Ejecución sin Docker](#ejecución-sin-docker)
* [Conexión con el backend](#conexión-con-el-backend)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Scripts disponibles](#scripts-disponibles)
* [Repositorio backend](#repositorio-backend)
* [Gestión del proyecto](#gestión-del-proyecto)
* [Declaración de uso de IA](#declaración-de-uso-de-ia)
* [Autor](#autor)

---

## Descripción

El frontend forma parte del Sistema de Gestión de PQR y consume los servicios proporcionados por el backend mediante una API REST.

La aplicación está orientada a dos escenarios principales:

### Ciudadano / Solicitante

Permite:

* Registrar una nueva PQR.
* Ingresar información del solicitante.
* Seleccionar tipo, categoría y prioridad.
* Consultar una PQR.
* Buscar una solicitud mediante su radicado.
* Consultar el estado de la solicitud.
* Visualizar información detallada de la PQR.

### Agente interno

Permite:

* Consultar las PQR registradas.
* Filtrar solicitudes.
* Visualizar el detalle de una PQR.
* Consultar información del solicitante.
* Consultar el agente asignado.
* Actualizar el estado de una PQR.
* Registrar seguimientos.
* Consultar el historial de seguimiento.
* Visualizar información estadística mediante el dashboard.

---

## Funcionalidades

### Gestión pública de PQR

* Registro de PQR mediante formulario.
* Validación de información.
* Captura de datos del solicitante.
* Selección de tipo de PQR.
* Selección de categoría.
* Selección de prioridad.
* Consulta mediante radicado.

### Gestión interna

* Listado de PQR.
* Filtros por diferentes criterios.
* Visualización del detalle.
* Gestión del estado.
* Registro de seguimiento.
* Visualización del historial.
* Información del solicitante y agente asignado.

### Dashboard

* Visualización de estadísticas.
* Distribución de PQR por estado.
* Distribución de PQR por tipo.
* Indicadores generales de gestión.

---

## Stack tecnológico

| Tecnología     | Uso                               |
| -------------- | --------------------------------- |
| React 19       | Construcción de la interfaz       |
| Vite 8         | Herramienta de desarrollo y build |
| React Router   | Navegación entre vistas           |
| Axios          | Consumo de API REST               |
| Recharts       | Gráficos y estadísticas           |
| jwt-decode     | Decodificación de información JWT |
| JavaScript     | Lenguaje principal                |
| Node.js 20     | Entorno de construcción           |
| Nginx          | Servidor de archivos estáticos    |
| Docker         | Contenerización                   |
| Docker Compose | Orquestación local                |

---

## Requisitos

### Opción recomendada: Docker

Se requiere:

* Git
* Docker
* Docker Compose

No es necesario instalar Node.js para ejecutar el frontend mediante Docker.

### Ejecución local sin Docker

Se requiere:

* Node.js 20 o compatible
* npm

---

## Arquitectura

El frontend utiliza una arquitectura basada en componentes y servicios para separar la presentación de la comunicación con el backend.

```text
                 ┌──────────────────────┐
                 │       Usuario        │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    React / Vite      │
                 │      Frontend        │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │        Axios         │
                 │   Servicios API      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   FastAPI Backend    │
                 │      REST API        │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │     PostgreSQL       │
                 └──────────────────────┘
```

En producción o ejecución mediante Docker, la aplicación compilada de React es servida mediante Nginx.

---

## Configuración

La URL del backend se configura mediante la variable:

```env
VITE_API_URL=http://localhost:8000
```

En Docker, esta variable se proporciona como argumento durante la construcción de la imagen:

```yaml
build:
  context: .
  args:
    VITE_API_URL: http://localhost:8000
```

Vite incorpora las variables `VITE_*` durante el proceso de construcción de la aplicación.

---

## Inicio rápido con Docker

Clonar el repositorio:

```bash
git clone <https://github.com/yil12/Sistema-de-gestion-PQR-Front.git>
```

Ingresar al proyecto:

```bash
cd <Sistema-de-Gestion-PQR-Front>
```

Construir y ejecutar:

```bash
docker compose up --build
```

Una vez finalizada la construcción, acceder a:

```text
http://localhost:5173
```

El frontend utilizará el backend disponible en:

```text
http://localhost:8000
```

### Detener la aplicación

```bash
docker compose down
```

### Reconstruir después de realizar cambios

```bash
docker compose up --build
```

---

## Ejecución sin Docker

Instalar las dependencias:

```bash
npm ci
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Por defecto, Vite ejecutará la aplicación en:

```text
http://localhost:5173
```

La aplicación debe tener configurada la URL del backend mediante una variable de entorno:

```env
VITE_API_URL=http://localhost:8000
```

---

## Conexión con el backend

El frontend consume la API REST desarrollada con FastAPI.

Repositorio del backend:

https://github.com/yil12/Sistema-de-Gestion-PQR

Backend local:

```text
http://localhost:8000
```

Documentación interactiva de la API:

```text
http://localhost:8000/docs
```

Frontend local:

```text
http://localhost:5173
```

### Flujo de comunicación

```text
Navegador
    │
    │ HTTP
    ▼
React
    │
    │ Axios
    ▼
FastAPI
    │
    ▼
PostgreSQL
```

El backend debe estar ejecutándose para que las operaciones que requieren información persistida funcionen correctamente.

---

## Estructura del proyecto

La estructura principal del frontend está organizada de la siguiente manera:

```text
Sistema-de-Gestion-PQR/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

La estructura puede evolucionar durante el desarrollo manteniendo la separación entre componentes visuales, vistas, servicios de comunicación y estilos.

---

## Scripts disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo de Vite.

### Construcción

```bash
npm run build
```

Genera la versión optimizada para producción.

### Vista previa

```bash
npm run preview
```

Permite ejecutar localmente la aplicación compilada.

### Linter

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

---

## Repositorio backend

El backend del sistema se encuentra en un repositorio independiente:

https://github.com/yil12/Sistema-de-Gestion-PQR

Tecnologías principales del backend:

* Python
* FastAPI
* SQLAlchemy
* Alembic
* PostgreSQL
* Docker
* Docker Compose

La documentación de instalación y ejecución del backend se encuentra en su propio README.

---

## Gestión del proyecto

El desarrollo del sistema se gestionó mediante Jira utilizando:

* Épicas.
* Historias de usuario.
* Tareas técnicas.
* Estimaciones.
* Registro de tiempo de trabajo.
* Seguimiento del avance.

El trabajo se organizó de manera incremental en las siguientes etapas:

```text
Análisis y requerimientos
        ↓
Diseño
        ↓
Modelado de datos
        ↓
Backend / API
        ↓
Persistencia y migraciones
        ↓
Frontend
        ↓
Integración
        ↓
Validación
        ↓
Documentación
```

---

## Declaración de uso de IA

Durante el desarrollo del proyecto se utilizaron herramientas de Inteligencia Artificial como apoyo al proceso de desarrollo.

La IA fue utilizada principalmente para:

* Consulta de conceptos técnicos.
* Exploración de alternativas de implementación.
* Apoyo en la estructuración inicial de código.
* Revisión de código.
* Análisis y solución de errores.
* Apoyo en documentación técnica.
* Consulta sobre React, Vite, Docker y otras tecnologías utilizadas.
* Revisión y mejora de estructuras existentes.

El código y las decisiones finales fueron revisados, adaptados y validados durante el desarrollo del proyecto.

La IA fue utilizada como herramienta de apoyo y no como sustituto del proceso de análisis y desarrollo.

---

## Autor

**Yilber Enrique Molina Devoz**

Ingeniero de Sistemas
Cartagena, Colombia

---

## Proyecto

**Sistema de Gestión de PQR**

Frontend desarrollado como parte de la prueba técnica para la Fundación Sersocial IPS.
