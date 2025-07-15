# בסיס: Node.js רשמי לבניית הפרונט
FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# שלב להרצת השרת עבור הפרונט (serve)
FROM node:18-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build"]
