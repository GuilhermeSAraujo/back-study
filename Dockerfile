# ---- Stage 1: Builder ----
    FROM node:22.20.0-alpine AS builder

    WORKDIR /app
    
    # Instala pnpm globalmente
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    # Copia apenas arquivos de dependências para aproveitar cache
    COPY pnpm-lock.yaml package.json ./
    
    # Instala todas as dependências (inclui devDeps para build)
    RUN pnpm install --frozen-lockfile
    
    # Copia o restante do projeto
    COPY tsconfig.json ./
    COPY src ./src
    
    # Compila o TypeScript para /dist
    RUN pnpm run build
    
    
    # ---- Stage 2: Runtime ----
    FROM node:22.20.0-alpine AS runner
    WORKDIR /app
    
    # Ativa o pnpm no ambiente final (caso precise)
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    ENV NODE_ENV=production
    
    # Copia apenas os artefatos necessários do builder
    COPY --from=builder /app/dist ./dist
    COPY package.json pnpm-lock.yaml ./
    
    # Instala apenas dependências de produção
    RUN pnpm install --prod --frozen-lockfile
    
    # Cria um usuário não-root (boa prática)
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    USER appuser
    
    # Expõe a porta usada pelo servidor
    EXPOSE 3001
    
    # Comando de inicialização
    CMD ["node", "dist/index.js"]
    