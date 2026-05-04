# Stage 1: Build the React Application
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set API URL to empty string so it uses relative paths, relying on NGINX proxy
ENV REACT_APP_API_URL=""

RUN npm run build

# Stage 2: Serve the app with NGINX
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Copy our custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
