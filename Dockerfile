
# Usamos una imagen de Node.js basada en Debian (más compatible que Alpine)
FROM node:18

# Establecemos el directorio de trabajo
WORKDIR /app

# Instalamos herramientas de compilación necesarias para bcrypt
RUN apt-get update && apt-get install -y build-essential python3 make g++

# Copiamos los archivos de dependencias
COPY package*.json ./
COPY my_custom.cnf ./
# Limpiamos node_modules si existe y la caché de npm
RUN rm -rf node_modules && npm cache clean --force

# Instalamos las dependencias, forzando la reconstrucción de bcrypt
RUN npm install
RUN npm install redis @types/redis
RUN npm rebuild bcrypt --build-from-source

# Ejecutar migraciones.
RUN npx ts-node src/infrastructure/config/runMigrations.ts
# Ejecutar datos semilla
RUN npx ts-node src/infrastructure/config/runSeeders.ts

# Copiamos el resto del código
COPY . .

# Exponemos el puerto
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]