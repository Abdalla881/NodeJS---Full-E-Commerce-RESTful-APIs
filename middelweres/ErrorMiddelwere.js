const AppError = require("../utils/AppError");

const ErrorForDev = (err, res) =>
  res.status(err.statusCode || 500).send({
    message: err.message,
    status: err.status || "error",
    isOperational: err.isOperational || false,
    Stack: err.stack,
  });
const ErrorForProd = (err, res) =>
  res.status(err.statusCode || 500).send({
    message: err.message,
    status: err.status || "error",
  });

const GlobalError = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    ErrorForDev(err, res);
  } else {
    if(err.name==='JsonWebTokenError'){
      err= new AppError('Invalid token ,please login again..')
    }
    if (err.name===`TokenExpiredError`) {
      err= new AppError('token Expired ,please login again..')
    }


    ErrorForProd(err, res);
  }
};

module.exports = GlobalError;
