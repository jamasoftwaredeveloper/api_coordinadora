# api_coordinadora
npm rebuild bcrypt --build-from-source
npm install
# Construir las imágenes:
docker-compose build --no-cache
# Levantar los contenedores
docker-compose up -d

# Ejecutar migraciones.
npx ts-node src/infrastructure/config/runMigrations.ts
# Ejecutar datos semilla
npx ts-node src/infrastructure/config/runSeeders.ts