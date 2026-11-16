# syntax=docker/dockerfile:1
#
# Front de Perdidos y adopciones (React 19 + Vite 7).
# Solo desarrollo: en producción el front lo sirve Vercel, no hace falta imagen de producción.
# Vite 7 pide Node 20.19+ / 22.12+.

FROM node:22-bookworm-slim AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5173
# --host 0.0.0.0: sin esto Vite solo escucha dentro del contenedor y el navegador no entra
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
