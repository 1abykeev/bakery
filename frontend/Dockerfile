# ── Frontend Dockerfile ─────────────────────────────────────────────────────
# Node 22 — compatible with Next.js 16 + React 19
FROM node:22-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files
COPY . .

# Bake the API URL into the Next.js build
# Browser makes API calls to localhost:8000 on the host machine
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]