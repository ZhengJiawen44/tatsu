FROM node:20-alpine
WORKDIR tatsu
COPY prisma ./prisma
COPY package* .
RUN npm install --verbose
COPY . .
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "start"]