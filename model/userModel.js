// const mongoose = require("mongoose")
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator"



//name, email, photo, password, passwordComfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"] 
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Please provide your password"],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true, "Please confirm your password"], 
        validate: {
            //This only works on CREATE and SAVE!!!
            validator: function(el) {
                return el === this.password; // abc===abc
            },
            message: "Passwords are not the same!"
        }
    },
    role: { // Add the role field here
        type: String,
        enum: ['user', 'admin', 'ceo'], // Adjust as necessary
        default: 'user' // Set a default role
    }, 
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }     
});
userSchema.pre("save", async function(next) {
    // Ony run this function if password actually modified
    if(!this.isModified("password")) return next();
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
})
userSchema.pre("save", function(next) {
    if(!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
userSchema.pre(/^find/, function(next) {
   // The points to the query 
   this.find({active: { $ne: false } });
   next();
});
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
   return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimestamp, JWTTimestamp)
        return JWTTimestamp < changedTimestamp; // 100 < 200
    }

    //False means NOT changed
    return false;
}

const User = mongoose.model("User", userSchema);
export default User;
// module.exports = User;