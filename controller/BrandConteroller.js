const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const BRAND = require("../Model/BrandModel");
const { uploadSingleImage } = require("../middelweres/uploadImage");

const factory = require("./HandlerFactory");

//upload Single Image
exports.uploadBrandImage = uploadSingleImage("image");

//image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
if(req.file)
  {  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  //save image into our DB
  req.body.image = filename;
}

  next();
});

// #desc Get All Brands
// #route Get /api/v1/Brands
// #Access  Public
exports.GetBrands = factory.GetAll(BRAND);

// #desc Get Specific Brand by id
// #route Get /api/v1/Brands/id:
// #Access  Public
exports.GetBrand = factory.GetOne(BRAND);

// #desc create Brand
// #route Post /api/v1/Brand
// #Access  privet/('admin','manger')
exports.CreateBrand = factory.createOne(BRAND);

// #desc Update Specific Brand
// #route PUT /api/v1/Brands/:id
// #Access  privet/('admin','manger')
exports.UpdateBrand = factory.updateOne(BRAND);

// #desc Delete Specific Brand
// #route DELETE /api/v1/Brands/:id
// #Access  privet/('admin','manger')

exports.deleteBrand = factory.deleteOne(BRAND);
