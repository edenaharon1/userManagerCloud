# בסיס: Node.js רשמי
FROM node:18

# הגדרת תיקיית עבודה
WORKDIR /app

# העתקת קבצי package.json ו- package-lock.json
COPY package*.json ./

# התקנת תלותים
RUN npm install --production

# העתקת כל הקוד
COPY . .

# חשיפת פורט האפליקציה
EXPOSE 3001

# פקודת הפעלה
CMD ["node", "index.js"]



