# Use an official Node.js image as a base image for the backend
FROM node:16

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend application code to the container
COPY . .

# Expose the port that the Express.js app will run on
EXPOSE 3001

# Command to run the Express.js app when the container starts
CMD ["node", "app.js"]
