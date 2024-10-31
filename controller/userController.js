import User from "../model/userModel.js";
import multer from "multer";
import sharp from "sharp"

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/imgs/user");
//     },
//     filename: (req, file, cb) => {
//         // user-76767676-332323
//         const ext = file.mimetype.split("/")[1];
//         cb(null, `user-${req.user.id}-${Date.now().$(ext)}`);
//     }
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images"), false);
    }
  };
  
  // In your route, handle the error:
  app.use((err, req, res, next) => {
    if (err.message === "Not an image! Please upload only images") {
      return res.status(400).json({
        status: "fail",
        message: err.message
      });
    }
    next();
  });

const upload = multer ({
    storage: multerStorage,
    fileFilter: multerFilter
});

export const uploadUserPhoto = upload.single("photo") 

export const resizeUserPhoto = async (req, res, next) => {
    try {
    if(!req.file) return next();
    // req.file.filename = `user-${req.user.id}-${Date.now().jpeg}`;
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;


    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({quality: 90})
    .toFile(`public/imgs/user/${req.file.filename}`);
    next();  
} catch (error) {
    return res.status(500).json({
        status: "fail",
        message: "Error resizing the photo",
        error: error.message
      });      
} 
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        // SEND RESPONSE
    res.status(200).json({
        status:"success",
        message:"All question get successfully",
        numResults:users.length,
        data:{
            users
        }
    });
    // export const getUser = (req, res) => {
    //     res.status(500).json({
    //         status:"success",
    //         message:"This route is not yet define",
    //     });
    // }
    } catch (error) {
       res.status(500).json({error}); 
    }
};
export const updateMe = async (req, res, next) => {
    try {
        console.log(req.file);
        console.log(req.body);
  // 1) Create error if user POSTs password Data
    if (req.body.password || req.body.passwordConfirm) {
        return res.status(400).json({
            status: "fail",
            message: "This route is not for password update. Please use /updateMyPassword."
        });  
    }
     // 2) Filter out the unwanted fields names that that are not allowed to be updated
     const filteredBody = filterObj(req.body, "name", "email");
     if (req.file) filteredBody.photo = req.file.filename;
     // 3) Update user document
     const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: 
        true, runValidators: true});
      return res.status(200).json({
         status: "success",
         message: "",
         data:{
            user: updatedUser
        }
      }); 
           
    } catch (error) {
     res.status(500).json({error}); 
    }
};

export const deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false})
  return res.status(204).json({
    status: "success",
    message: "",
    data: null
 });
}