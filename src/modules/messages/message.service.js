import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/index.js";
import messageModel from './../../DB/models/message.model.js';


// ---------------------------------------------sendMessage---------------------------------------------------
export const sendMessage = asyncHandler(async (req, res, next) => {
    const { content, userId } = req.body;
    if (!await userModel.findOne({ _id: userId, isDeleted: false })) {
        return next(new Error("User not found"));
    }
    const message = await messageModel.create({ content, userId });
    return res.status(201).json({ message: "done", message });

})


// ---------------------------------------------getMessages---------------------------------------------------
export const getMessages = asyncHandler(async (req, res, next) => {
    const messages = await messageModel.find({ userId: req.user._id }).populate([
        {
            path: 'userId',
            select: 'name email'
        }
    ]);
    return res.status(201).json({ message: "done", messages });

})