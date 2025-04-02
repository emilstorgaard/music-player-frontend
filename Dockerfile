# Use official Node.js image as base
FROM node:latest

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY . .

# Install dependencies
RUN yarn

# Manually install jsonwebtoken
RUN yarn add jsonwebtoken
# npm install -D @types/jsonwebtoken

# Copy the rest of the application code
RUN yarn build

# Expose port 8180 to the outside world
EXPOSE 8180

# Command to run the application
CMD ["yarn", "preview", "--", "--port", "8180", "--host", "0.0.0.0"]