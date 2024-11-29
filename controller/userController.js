import User from "../model/userModel.js";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const dir = "public/imgs/user";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Please upload an image."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = async (req, res, next) => {
  try {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/imgs/user/${req.file.filename}`);
    next();
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      message: "All question get successfully",
      numResults: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message:
          "This route is not for password update. Please use /updateMyPassword.",
      });
    }

    const filteredBody = filterObj(req.body, "name", "email");
    if (req.file) filteredBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
