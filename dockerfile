# Etapa 1: construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar todo el proyecto
COPY . .

# Etapa 2: producción
FROM node:20-alpine AS production
WORKDIR /app

# Copiar node_modules desde el builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar solo el backend
COPY --from=builder /app/backend ./backend

# Copiar el front
COPY --from=builder /app/frontend ./frontend

EXPOSE 3000

# Arrancar el servidor
CMD ["node", "backend/server.js"]