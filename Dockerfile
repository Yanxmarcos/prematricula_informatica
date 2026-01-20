# Etapa 1: Base e instalación de dependencias
FROM node:18-alpine AS base

# Instalar dependencias necesarias para alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Etapa 2: Construcción (Build)
FROM base AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Desactivar telemetría de Next.js para build
ENV NEXT_TELEMETRY_DISABLED 1

# Construir el proyecto
RUN npm run build

# Etapa 3: Ejecución (Runner)
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios del build standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copiar prisma para poder ejecutar migraciones al iniciar
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
# Al iniciar, empujamos la estructura de la DB y luego iniciamos la app
CMD npx prisma db push && node server.js