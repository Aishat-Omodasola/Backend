import User from "../model/userModel.js"
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
  // 1) Create error if user POSTs password Data
    if (req.body.password || req.body.passwordConfirm) {
        return res.status(400).json({
            status: "fail",
            message: "This route is not for password update. Please use /updateMyPassword."
        });  
    }
     // 2) Filter out the unwanted fields names that that are not allowed to be updated
     const filteredBody = filterObj(req.body, "name", "email");
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