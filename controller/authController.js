// const User = require("../model/userModel");
import crypto from "crypto"
import User from "../model/userModel.js";
import jwt from "jsonwebtoken"
import { promisify } from "util"
import sendEmail from "../utilities/email.js"

const signToken = id =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
         Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60* 1000 ),
         httpOnly: true
        }
        if(process.env.NODE_ENV === "production") cookieOptions.secure = true; 

    res.cookie("JWT", token, cookieOptions); 
    // Remove the password from the output
    user.password = undefined;
    
    res.status(statusCode).json({
        status: "success",
        token,
        data:{
            user
        }
    });
}
export const signup = async (req, res, next) => {
   try {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
   } catch (error) {
    res.status(500).json({
        status: "fail",
        message: "Error signing up",
        error: error.message
    });
       
   }

   
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // 1) check if email and password exist
        if(!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide email and password!"
            });
        }
        // 2) check if user exist and password correct
        const user = await User.findOne({email}).select("+password");
        // const correct = ;
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect email or password!"
            });
        }
        // 'pass123' === '$2a$12$1/MLeJGEi4.83/oq69wzdeuHLU35KQbBv39jYNbI5bNxNwIDs6KCe'
        // console.log(user);
        // 3) if everything is ok, send Token to client
        createSendToken(user, 200, res);  
    } catch (error) {
        res.status(500).json({error});  
    }
  
};

export const protect = async (req, res, next) => {
    try {
    //1) Getting token and check of it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
     token = req.headers.authorization.split(" ")[1];
    }
    // console.log(token);
    if(!token) {
        return res.status(401).json({
            status: "fail",
            message: "You are not logged in! Please log in to get access."
        });
    }
    //2) Verification Token
    let decoded;
    try {
         decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded)
    } catch (error) {
        {
            return res.status(401).json({
                status: "fail",
                message: "Invalid token. Please log in again!"
            });
        }  
    }
    
    //3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return res.status(401).json({
            status: "fail",
            message: "The user belongging to this token does not longer exist."
        });
    }
    // 4) Check if user change password after the token was issued
       if (currentUser.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({
            status: "fail",
            message: "User recently changed password! Please login again"
        });
       }
       //GRANT ACCESS TO PROTECTED ROUTE
       req.user = currentUser;
       next(); 
    } catch (error) {
        res.status(500).json({error});   
    }
};
export const restrictTo = (...roles) => {
    return (req, res, next) => {
    // roles ['admin', "lead-guide"]. role="user"
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            status: "fail",
            message: "You do not have permission to perform this action"
        });
    } 
    next();
    };
};
export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.status(404).json({
            status: "fail",
            message: "There is no user with that email address."
          });
        }
      
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });
      
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();
      
        res.status(200).json({
          status: "success",
          message: "Token sent to email!"
        });
      } catch (error) {
        res.status(500).json({
          status: "fail",
          message: "There was an error processing your request",
          error: error.message
        });
      }
      
//    try {
//        // Log to check if email is received
//        console.log("Received email: ", req.body.email)
//        // Get user based on POSTed email
//     const user = await User.findOne({email: req.body.email});
//     if (!user) {
//         return res.status(404).json({
//             status: "fail",
//             message: "There is no user with email adress"
//         });
//     } 

//     //Generate the random reset token
//     const resetToken = user.createPasswordResetToken();
//     await user.save({validateBeforeSave: false}); // If you send the token to the user via email, log that you're doing it (for debugging)
//        console.log("Password reset token created: ", resetToken);
//         // If you send the token to the user via email, log that you're doing it (for debugging)
//         console.log("Password reset token created: ", resetToken);
//         res.status(200).json({
//             status: "success",
//             message: "Password reset token generated"
//         });
//         try {
//     // 3) send it to user's email
//     const resetURL = `${req.protocol}://${req.get(
//         "host")}/api/v1/resetPassword/${resetToken}`;
//     await new Email(user, resetURL).sendPasswordReset();
//     res.status(200).json({
//         status: "success",
//         message: "Token sent to email!"
//     });
//     } catch (error) {
//       user.passwordResetToken = undefined; 
//       user.passwordResetExpires = undefined;
//       await user.save({validateBeforeSave: false}); 
//       return res.status(500).json({
//         status: "fail",
//         message: "There was an error sending the email. Try again later!"
//     });
//     }
//    } catch (error) {
//     // console.error("Error in forgotPassword: ", error);
//        res.status(500).json({
//            status: "fail",
//            message: "Error processing the forgot password request",
//            error: error.message
//        });
//    }
};

export const resetPassword = async (req, res, next) => {
    // Get user based on the Token
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
     // If token has not expired, and there is user, set the new password
     if (!user) {
        return res.status(400).json({
            status: "fail",
            message: "Token is invalid, or has expired"
        }); 
     }
     user.password = req.body.password;
     user.passwordConfirm = req.body.passwordConfirm;
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
     // 3) Update changedPasswordAt property for the user
     // 4) Log the user in, send JWT
     user.password = undefined;
     await createSendToken(user, 200, res);
};

export const updatePassword = async (req, res, next) => {
    try {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return res.status(401).json({
            status: "fail",
            message: "Your current password is wrong"
        });
    }
    // 3) If so, update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // user.findByIdAndUpdate will not work as intented!
    // 3) Log user name, send JWT
    createSendToken(user, 200, res);
} catch (error) {
    res.status(500).json({
        status: "fail",
        message: "Error updating the password",
        error: error.message
     });       
}
};