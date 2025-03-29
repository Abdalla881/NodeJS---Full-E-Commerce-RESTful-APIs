const crypto = require("node:crypto");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const USER = require("../Model/UserModel");
const AppError = require("../utils/AppError");
const createToken = require("../utils/createToken");
const { sendEmail } = require("../utils/sendEmail");

// #desc Post  signUp
// #route Get /api/v1/auth/signup
// #Access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await USER.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = createToken(user.id);
  res.status(200).json({ Data: user, token });
});

// #desc Post  login
// #route Get /api/v1/auth/login
// #Access  Public
exports.login = asyncHandler(async (req, res, next) => {
  //check if user is exist and password is correct
  const user = await USER.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("Incorrect password or email"), 401);
  }

  // genrate token
  const token = createToken(user.id);

  res.status(200).json({ Data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // check if token exist
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(
      new AppError("You are not login , Please login to get this route", 401)
    );
  }

  // verify token (no change happens , expire token )

  const decoded = jwt.verify(token, process.env.Secret_Key);
  // check if user for token exist

  const currentuser = await USER.findById(decoded.userId);
  if (!currentuser) {
    return next(
      new AppError(
        "the user belong that to this token does no longer exist",
        401
      )
    );
  }

  //check if password are changed after get token
  if (currentuser.changePasswordAt) {
    const changeTimeToTimestamps = parseInt(
      currentuser.changePasswordAt.getTime() / 1000,
      10
    );

    // Password changed after token created (Error)
    if (changeTimeToTimestamps > decoded.iat) {
      return next(
        new AppError("User Recently changed password , please login again", 401)
      );
    }
  }

  req.user = currentuser;
  next();
});

// #desc Authencation
// #Access  Public
exports.AllowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

// #desc Post  forgot Password
// #route Get /api/v1/auth/forgotPassword
// #Access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //find user by email
  const user = await USER.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(`There is no user for this email ${req.body.email}`, 404)
    );
  }
  //if user exust ,Genrate reset random 6 digit and save it iin db
  const ResetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const secret = "abcdefg";
  user.hashResetcode = crypto
    .createHmac("sha256", secret)
    .update(ResetCode)
    .digest("hex");

  user.PasswordResetExpire = Date.now() + 10 * 60 * 1000;
  user.PasswordResetcodeVerified = false;

  user.save();

  //send email

  const message = `Dear [${user.name}] \n
  You recently requested to reset your password. Use the following code to complete the process: \n
  [${ResetCode}] 
  If you did not request this, please ignore this email. For security reasons, this code will expire in [ 10 min ].\n
  Best regards,\n
  [E-Shop App]\n
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Code",
      message,
    });
  } catch (error) {
    user.hashResetcode = undefined;
    user.PasswordResetExpire = undefined;
    user.PasswordResetcodeVerified = undefined;

    await user.save();
    return next(new AppError("There is an error in sending email"), 500);
  }

  res.status(200).json({ status: "success", msg: "Reset Code Send Email" });
});

// #desc Post  verify password
// #route Get /api/v1/auth/verifyPassword
// #Access  Public

exports.verifyPassword = asyncHandler(async (req, res, next) => {
  //Hash ResetCode to search in DB
  const secret = "abcdefg";
  const hashResetcode = crypto
    .createHmac("sha256", secret)
    .update(req.body.resetCode)
    .digest("hex");

  const user = await USER.findOne({
    hashResetcode: hashResetcode,
    PasswordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Reset Code invalid or expired", 401));
  }

  user.PasswordResetcodeVerified = true;
  await user.save();

  res.status(200).json({ status: "Success" });
});

// #desc Post  Reset Password
// #route Get /api/v1/auth/resetPssword
// #Access  Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await USER.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(`There is no user for this email ${req.body.email}`, 404)
    );
  }

  if (user.PasswordResetcodeVerified === false) {
    return next(new AppError(`Reset Code is not verified`, 400));
  }
  user.password = req.body.newPassword;

  user.PasswordResetExpire = undefined;
  user.PasswordResetcodeVerified = undefined;
  user.hashResetcode = undefined;

  await user.save();

  const token = createToken(user.id);

  res.status(200).json({ token });
});

// #desc Post  get Logged User Data
// #route Get /api/v1/auth/getMe
// #Access  protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;

  next();
});

// #desc Post change Logged User Password
// #route Put /api/v1/auth/changeMyPassword
// #Access  protect
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
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

  const token = createToken(user._id);
  res.status(200).json({ user, token });
});

// #desc Post  get Logged User Data
// #route Put /api/v1/auth/updateMe
// #Access  protect

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await USER.findOneAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ user });
});

// #desc Post  deactivate User
// #route delete /api/v1/auth/deactivate
// #Access  protect

exports.deactivate = asyncHandler(async (req, res, next) => {
  const user = await USER.findOneAndUpdate(req.user._id, {
    active: false,
  });

  res.status(204).json({ msg: "user deactivate Successfully " });
});
