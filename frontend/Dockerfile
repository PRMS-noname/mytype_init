FROM node:18-alpine

WORKDIR /app


COPY package*.json ./

RUN npm install --legacy-peer-deps && npm install --save-dev @types/node


COPY . .


RUN npm run build

# Expose preview port
EXPOSE 3000

# For development mode
CMD ["npm", "run", "dev"]
