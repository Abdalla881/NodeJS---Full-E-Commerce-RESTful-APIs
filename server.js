const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");

const app = express();
dotenv.config({ path: "config.env" });
const port = process.env.PORT || 3000;

const dbConnection = require("./config/dbConnection");
const AppError = require("./utils/AppError");
const GlobalError = require("./middelweres/ErrorMiddelwere");
const { webHookCheckout } = require("./controller/OrderConteroller");

app.use(cors());
app.options("*", cors()); // include before other routes

// compress responses
app.use(compression());

// ✅ Webhook route must use `express.raw()` for Stripe verification
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webHookCheckout
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// ✅ Use JSON parsing for other routes
app.use(bodyParser.json());

//Mount Route
const mountRoute = require("./Router/server");

mountRoute(app);

app.get("/", (req, res) => {
  res.send("API is working!");
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
