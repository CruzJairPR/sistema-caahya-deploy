FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar la aplicación (necesario para el modo start)
RUN npm run build

EXPOSE 3000

# Forzar a Next.js a escuchar en todas las interfaces de red del contenedor
ENV HOSTNAME="0.0.0.0"

# Iniciar Next.js en modo producción
CMD ["npm", "start"]