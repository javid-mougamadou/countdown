############################
# Base deps layer
############################
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

############################
# Development image
############################
FROM node:20-alpine AS dev
WORKDIR /app

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5173
CMD ["npm","run","start"]

############################
# Build image
############################
FROM node:20-alpine AS build
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

############################
# Production image (nginx)
############################
FROM nginx:1.27-alpine AS prod
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=build /app/dist ./

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
