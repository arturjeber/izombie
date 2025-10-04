**use PNPM**

- NextJS 15
- Typescrypt
- Docker
- Tailwind
- Prisma
- NextAuth v5
- Middleware
- API protected
- tRPC
- Husky e Lint-staged
- Eslist / Prettier
- Unit test
- E2E test
- PWA

1-
pnpm install

2-
create .env
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
NEXTAUTH_SECRET=

openssl rand -hex 32

3-
docker-compose down
docker-compose build --no-cache                        
docker-compose up -d

npx prisma studio  