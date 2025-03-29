const multer = require("multer");
const AppError = require("../utils/AppError");

// This function sets up the configuration for multer (file upload)
const multerOption = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError(`just image allowed`, 400));
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

// This function enables uploading single image
exports.uploadSingleImage = (field) => multerOption().single(field);

// This function enables uploading multiple images with different field names.
exports.uploadsMultiImage = (arryOfField) => multerOption().fields(arryOfField);
