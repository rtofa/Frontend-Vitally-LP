# ==========================================
# Etapa 1: Instalação de Dependências
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json* ./
RUN npm ci

# ==========================================
# Etapa 2: Construção (Build)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desativa a telemetria do Next.js para economizar processamento
ENV NEXT_TELEMETRY_DISABLED=1

# Compila o projeto
RUN npm run build

# ==========================================
# Etapa 3: Produção (A imagem final leve)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Cria um usuário não-root por segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os arquivos estáticos públicos
COPY --from=builder /app/public ./public

# Copia a build "standalone" gerada no Passo 1
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Inicia o servidor Node.js otimizado
CMD ["node", "server.js"]