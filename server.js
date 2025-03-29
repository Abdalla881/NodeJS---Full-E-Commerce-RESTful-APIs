const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

const app = express();
dotenv.config({ path: "config.env" });
const port = process.env.PORT;

const dbConnection = require("./config/dbConnection");
const AppError = require("./utils/AppError");
const GlobalError = require("./middelweres/ErrorMiddelwere");

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.options("*", cors()); // include before other routes

// compress responses
app.use(compression());

//Mount Route
const mountRoute = require("./Router/server");

mountRoute(app);

// Catch-all route for handling non-existent routes
app.all("*", (req, res, next) => {
  next(new AppError("Route not found", 404));
});

// Log HTTP requests in development mode and display the current environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Global error handling middleware
app.use(GlobalError);

const server = app.listen(port, () => {
  console.log(`server run on port http://localhost:${port}`);
});

// Handle unhandled promise rejections gracefully
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);

  server.close(() => {
    console.log("Server shutting down due to an unhandled rejection.");
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 5000);
});
