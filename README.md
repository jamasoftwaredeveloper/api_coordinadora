# API Coordinadora

Este repositorio contiene una API para la gestión de servicios de coordinadora.

## Requisitos previos

Para ejecutar correctamente este proyecto necesitas tener instalado:

- **Node.js**: Versión recomendada 18.20.6 (verificado que funciona correctamente)
- **Redis**: Para gestión de caché y colas de tareas
- **MySQL**: Como base de datos principal
- **Git**: Para control de versiones
- **Docker**: (Opcional) Para entorno containerizado

## Instalación

### Clonación del repositorio

Selecciona una ubicación en tu sistema y ejecuta:

```bash
git clone https://github.com/jamasoftwaredeveloper/api_coordinadora.git
```

### Configuración inicial

1. Navega al directorio del proyecto:
   ```bash
   cd api_coordinadora
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Si encuentras problemas con bcrypt, ejecuta:
   ```bash
   npm rebuild bcrypt --build-from-source
   npm install
   ```

4. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Edita el archivo `.env` con los valores adecuados para tu entorno

   ```bash
   cp .env.example .env
   # Edita el archivo .env con tu editor preferido
   ```

### Configuración de la base de datos
#Nota:
Si trabajas con docker, lo ejecutas en la consola como se muestra en el video.
1. Ejecuta las migraciones para crear las tablas en la base de datos:
   ```bash
   npx ts-node src/infrastructure/config/runMigrations.ts
   ```

2. Carga los datos iniciales:
   ```bash
   npx ts-node src/infrastructure/config/runSeeders.ts
   ```

## Ejecución del proyecto

Inicia el servidor con:

```bash
npm run dev
```

## Cuentas de prueba

El sistema incluye los siguientes usuarios predefinidos:

### Administrador
- **Email**: admin@gmail.com
- **Contraseña**: 123456789

### Clientes
- **Email**: test@gmail.com
- **Contraseña**: 123456789

- **Email**: user3@gmail.com
- **Contraseña**: 123456789

## Pruebas

Para ejecutar las pruebas automatizadas:

```bash
npm run test
```

## Despliegue con Docker

Si prefieres utilizar Docker, sigue estos pasos:

> **Nota importante**: Asegúrate de tener Docker Desktop ejecutándose.

1. Construir las imágenes (sin usar caché para asegurar versiones actualizadas):
   ```bash
   docker-compose build --no-cache
   ```

2. Levantar los contenedores en modo detached:
   ```bash
   docker-compose up -d
   ```
# URL
Para ingresar a la documentación
http://localhost:4000/api-docs/

## Estructura del proyecto

La API sigue principios de arquitectura limpia y está organizada en capas para facilitar su mantenimiento y escalabilidad.

## Contribuciones

Si deseas contribuir al proyecto, por favor crea un fork y envía un Pull Request con tus mejoras.
