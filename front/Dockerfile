# --- Construction du site Angular (build de production)
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx ng build

# --- Service : nginx sert le site et relaie /api vers l'API Spring Boot
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/front/browser /usr/share/nginx/html
