From node:20-alpine
WORKDIR tatsu
COPY prisma ./prisma
COPY package* .
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "start"]