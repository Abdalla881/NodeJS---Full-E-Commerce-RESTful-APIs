const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const { uploadsMultiImage } = require("../middelweres/uploadImage");
const PRODUCT = require("../Model/ProductModel");
const factory = require("./HandlerFactory");

// This function enables uploading multiple images with different field names.
exports.uploadProductImage = uploadsMultiImage([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverName}`);
    req.body.imageCover = imageCoverName;
  }
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (img, index) => {
        req.body.images = [];
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// #desc Get All Product
// #route Get /api/v1/Product
// #Access  Public
exports.GetProducts = factory.GetAll(PRODUCT);

// #desc Get Specific Product by id
// #route Get /api/v1/Product/id:
// #Access  Public
exports.GetProduct = factory.GetOne(PRODUCT, "reviews");

// #desc create Product
// #route Post /api/v1/Product
// #Access  privet/('admin','manger')

exports.CreateProduct = factory.createOne(PRODUCT);

// #desc Update Specific Product
// #route PUT /api/v1/Product/:id
// #Access  privet/('admin','manger')

exports.UpdateProduct = factory.updateOne(PRODUCT);

// #desc Delete Specific Product
// #route DELETE /api/v1/Product/:id
// #Access  privet/('admin','manger')

exports.deleteProduct = factory.deleteOne(PRODUCT);
