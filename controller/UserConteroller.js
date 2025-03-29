const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const USER = require("../Model/UserModel");
const { uploadSingleImage } = require("../middelweres/uploadImage");
const AppError = require("../utils/AppError");

const factory = require("./HandlerFactory");

//upload Single Image
exports.uploadBrandImage = uploadSingleImage("profileImg");

//image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    //save image into our DB
    req.body.profileImg = filename;
  }

  next();
});

// #desc Get All Users
// #route Get /api/v1/Users
// #Access  privet/('admin')
exports.GetUsers = factory.GetAll(USER);

// #desc Get Specific User by id
// #route Get /api/v1/User/id:
// #Access  privet/('admin')
exports.GetUser = factory.GetOne(USER);

// #desc create User
// #route Post /api/v1/User
// #Access  privet/('admin')
exports.CreateUser = factory.createOne(USER);

// #desc Update Specific User
// #route PUT /api/v1/User/:id
// #Access  privet/('admin')
exports.UpdateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const data = await USER.findOneAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!data) {
    return next(new AppError(`Not document for this id ${id}`, 404));
  }
  res.status(200).json({ data });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const HashPassword = await bcrypt.hash(req.body.password, 12);
  const user = await USER.findOneAndUpdate(
    { _id: id },
    {
      password: HashPassword,
      changePasswordAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new AppError(`Not document for this id ${id}`, 404));
  }
  res.status(200).json({ user });
});

// #desc Delete Specific User
// #route DELETE /api/v1/User/:id
// #Access  privet/('admin')

exports.deleteUser = factory.deleteOne(USER);
