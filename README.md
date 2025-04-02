
# NodeJS Full E-Commerce RESTful APIs

This project is a complete **RESTful API** for an **E-Commerce platform** built using **Node.js** and **Express.js**. It provides essential functionalities such as user authentication, product management, cart handling, order processing, and payment integration.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16 or later)
- [MongoDB](https://www.mongodb.com/) (for database storage)

### Steps to Install
1. **Clone the repository**  
   ```bash
   git clone <repository_url>
   cd NodeJS-Full-E-Commerce-RESTful-APIs
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the root directory and add the necessary environment variables:
   ```plaintext
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Start the server**  
   ```bash
   npm start
   ```

5. **API is ready!**  
   You can now access the APIs at `http://localhost:5000`

## Usage

### 1. Run the Server
After installation, start the server with:
```bash
npm start
```
By default, the API runs at `http://localhost:5000`.

### 2. Testing the API
You can use tools like **Postman** or **cURL** to interact with the API once it is running locally.

## Features

- **Real-World Backend RESTful API**  
  A complete backend solution for an E-Commerce platform, ready for integration with mobile or web applications.

- **User Authentication & Authorization**  
  - Register & Login users with **JWT authentication**  
  - Email confirmation on signup  
  - Password reset & forgot password functionality  

- **Product Management**  
  - CRUD operations (Create, Read, Update, Delete)  
  - Advanced searching, sorting, pagination, and filtering  
  - Star rating system  

- **Shopping Features**  
  - Add to cart  
  - Add to wishlist  
  - Apply discount coupon codes  

- **Order & Payment Handling**  
  - Cash on delivery (COD) support (no online payment required)  
  - Credit card payment integration with **Stripe**  

- **Database & Middleware**  
  - **MongoDB Cloud** storage  
  - Advanced **Mongoose** queries & relationships between collections  
  - Image upload & multiple image handling (file uploading & processing)  
  - Express & Mongoose middleware for optimized request handling  

- **Security & Performance**  
  - Role-based access control (Admin/User)  
  - Secure API endpoints with JWT  
  - Data validation and error handling  

- **Modern JavaScript & Deployment**  
  - Uses modern ES6/ES7 features  
  - Ready for deployment on cloud platforms  

## Technologies Used

- **Node.js** - JavaScript runtime environment  
- **Express.js** - Backend framework for building RESTful APIs  
- **MongoDB** - NoSQL database for storing data  
- **Mongoose** - ODM (Object Data Modeling) for MongoDB  
- **JWT (JSON Web Token)** - Authentication and authorization  
- **bcrypt** - Password hashing for security  
- **compression** - Middleware for response body compression  
- **cors** - Handle Cross-Origin Resource Sharing  
- **cross-env** - Set environment variables across platforms  
- **dotenv** - Manage environment variables  
- **express** - Web framework for building APIs  
- **express-async-handler** - Handle asynchronous functions in Express  
- **express-validator** - Data validation middleware for Express  
- **morgan** - HTTP request logger middleware  
- **multer** - Middleware for handling file uploads  
- **nodemailer** - Email service for password reset & confirmation emails  
- **nodemon** - Automatic server restart during development  
- **sharp** - Image processing library  
- **slugify** - URL-friendly string generation  
- **stripe** - Online payment processing  
- **uuid** - Generate unique identifiers  
- **vercel** - Deployment platform  

## Contributing

We welcome contributions to this project! If you'd like to contribute, please follow these guidelines:

### How to Contribute

1. **Fork the repository**  
   Click on the **Fork** button at the top right of this page to create a copy of this repository on your GitHub account.

2. **Clone your forked repository**  
   Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/NodeJS-Full-E-Commerce-RESTful-APIs.git
   cd NodeJS-Full-E-Commerce-RESTful-APIs
   ```

3. **Create a new branch**  
   Create a new branch to work on your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**  
   Implement your feature or fix in the code.

5. **Lint your code**  
   Before committing your changes, please run ESLint and Prettier to ensure the code follows the style guidelines:
   ```bash
   npm run lint
   ```

6. **Commit your changes**  
   After making changes and ensuring they are linted, commit them:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

7. **Push your changes**  
   Push the changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a pull request**  
   Go to the original repository on GitHub and create a pull request to merge your changes into the `main` branch.

### Code Style Guidelines

This project uses **ESLint** and **Prettier** for consistent code style:

- **ESLint**: The project uses the **Airbnb** style guide for JavaScript and React.
  - Run `npm run lint` to check for linting errors.
  - Ensure your code adheres to the Airbnb JavaScript style and best practices.
- **Prettier**: Code should be automatically formatted using **Prettier**. You can format files by running:
  ```bash
  npm run prettier
  ```

### Code of Conduct

Please follow the [Code of Conduct](#) when contributing to this project. Be respectful, kind, and professional.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

This version excludes the **API Endpoints** and **Schema** sections and focuses on the general details, installation, usage, features, contributing guidelines, and technologies used. Let me know if you need further adjustments! 😊
