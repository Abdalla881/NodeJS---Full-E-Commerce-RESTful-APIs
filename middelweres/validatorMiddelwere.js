const { validationResult } = require("express-validator");

const validatorMiddelwere = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(404).json({ err: err.array() });
  }
  next();
};

module.exports = validatorMiddelwere;
