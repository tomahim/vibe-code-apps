FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN apk add --no-cache git && npm install

# Copy application files
COPY . .

# Create scenes directory
RUN mkdir -p /app/scenes

# Expose ports (backend on 1002, vite dev server on 5173)
EXPOSE 1002 5173

# Start the application
CMD ["npm", "run", "dev"]
