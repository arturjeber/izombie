# Base image Node.js
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache bash git openssh

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar package.json e pnpm-lock para cache
COPY package.json pnpm-lock.yaml ./

# Instalar dependências do workspace
RUN pnpm install

# Copiar todo o código do projeto
COPY . .

# Gerar o cliente Prisma
#RUN pnpm prisma generate

# Expõe a porta padrão do Next.js e do debugger
EXPOSE 3000 9229


# Comando default para desenvolvimento
CMD ["pnpm", "dev"]
