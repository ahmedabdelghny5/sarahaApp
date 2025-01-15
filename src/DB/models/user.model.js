
import mongoose from "mongoose";
import { roles } from "../../middleware/auth.js";


export const genderTypes = {
    male: 'male',
    female: 'female'
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    phone: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: Object.keys(genderTypes),
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.keys(roles),
        default: roles.user
    },
    passwordChangedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const userModel = mongoose.models.User || mongoose.model("User", userSchema)

export default userModel;