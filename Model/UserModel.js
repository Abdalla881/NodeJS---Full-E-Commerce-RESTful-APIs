const bcrypt = require("bcrypt");

/* eslint-disable new-cap */
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true,
      minLength: [2, "Too short User name"],
      maxlength: [32, "Too Long User name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Too Short Password"],
    },
    changePasswordAt: Date,
    hashResetcode: String,
    PasswordResetExpire: Date,
    PasswordResetcodeVerified: Boolean,

    role: {
      type: String,
      enum: ["user", "admin", "manger"],
      default: "user",
    },
    wishList: {
      type: [mongoose.Schema.ObjectId],
      ref: "Product",
    },

    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const UserModel = new mongoose.model("User", UserSchema);
module.exports = UserModel;
