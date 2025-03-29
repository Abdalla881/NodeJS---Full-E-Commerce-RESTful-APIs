const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const CATEGORY = require("../Model/CategoryModel");
const factory = require("./HandlerFactory");
const { uploadSingleImage } = require("../middelweres/uploadImage");

//upload Single Image
exports.uploadCateoryImage = uploadSingleImage("image");

//image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    //save image into our DB
    req.body.image = filename;
  }

  next();
});
// #desc Get All category
// #route Get /api/v1/category
// #Access  Public
exports.GetCategoryies = factory.GetAll(CATEGORY);

// #desc Get Specific category by id
// #route Get /api/v1/category/id:
// #Access  Public
exports.GetCategory = factory.GetOne(CATEGORY);

// #desc create category
// #route Post /api/v1/category
// #Access  privet/admin_manger
exports.CreatCategory = factory.createOne(CATEGORY);

// #desc Update Specific category
// #route PUT /api/v1/category/:id
// #Access  privet/admin_manger
exports.UpdateCategory = factory.updateOne(CATEGORY);

// #desc Delete Specific category
// #route DELETE /api/v1/category/:id
// #Access  privet/admin_manger

exports.deleteCategory = factory.deleteOne(CATEGORY);
