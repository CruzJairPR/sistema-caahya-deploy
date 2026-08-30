FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero para aprovechar la caché de capas
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

EXPOSE 5000

# Usar modo desarrollo (ajusta el comando según tu script de package.json, ej: dev, start:dev)
CMD ["node", "src/app.js"]