
import userModel from './../../DB/models/user.model.js';
import { roles } from '../../middleware/auth.js';
import { asyncHandler, eventEmitter, Encrypt, Decrypt, generateToken, Verify, Hash, Compare } from '../../utils/index.js';
import messageModel from '../../DB/models/message.model.js';


// ------------------------------------signup--------------------------------------------------------
export const signup = asyncHandler(async (req, res, next) => {
    const { name, email, password, gender, phone } = req.body
    // check email
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
        return next(new Error("email already exists", { cause: 409 }));
    }
    // hash password
    const hash = await Hash({ key: password, SALT_ROUNDS: process.env.SALT_ROUNDS })

    // encrypt phone
    var cipherText = await Encrypt({ key: phone, SECRET_KEY: process.env.SECRET_KEY })

    // send email verification link
    eventEmitter.emit("sendEmail", { email })
    // create
    const user = await userModel.create({ name, email, password: hash, gender, phone: cipherText })
    return res.status(201).json({ message: "done", user })

})


// ------------------------------------confirmEmail---------------------------------------------------
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    if (!token) {
        return next(new Error("Token not found"));
    }
    //  check if token is valid
    const decoded = await Verify({ token, SIGNATURE: process.env.EMAIL_CONFIRMATION_SIGNATURE })
    if (!decoded?.email) {
        return next(new Error("invalid token payload"));
    }
    //  update user status to confirmed
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true })
    if (!user) {
        return next(new Error("user not found or already confirmed"));
    }
    return res.status(201).json({ message: "done" })
})


// ------------------------------------signin--------------------------------------------------------
export const signin = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body
    // check email
    const user = await userModel.findOne({ email, confirmed: true });
    if (!user) {
        return next(new Error("email not exist or not confirmed yet", { cause: 400 }));
    }
    // check password
    const match = await Compare({ key: password, hashed: user.password })
    if (!match) {
        return next(new Error("invalid password", { cause: 400 }));
    }
    // generate token
    const token = await generateToken({
        payload: { email, id: user._id },
        SIGNATURE: user.role == roles.user ? process.env.TOKEN_SIGNATURE_USER : process.env.TOKEN_SIGNATURE_ADMIN
    })
    return res.status(201).json({ message: "done", token })
})


// ------------------------------------getProfile------------------------------------------------------
export const getProfile = asyncHandler(async (req, res, next) => {
    // decrypt phone
    req.user.phone = await Decrypt({ key: req.user.phone, SECRET_KEY: process.env.SECRET_KEY })
    const messages = await messageModel.find({ userId: req.user._id });
    return res.status(201).json({ message: "done", user: req.user, messages })
})


// ------------------------------------shareProfile------------------------------------------------------
export const shareProfile = asyncHandler(async (req, res, next) => {

    const user = await userModel.findById(req.params.id).select("name email phone")
    user ? res.status(201).json({ message: "done", user }) : res.status(404).json({ message: "user not found" })
})


// ------------------------------------updateProfile------------------------------------------------------
export const updateProfile = asyncHandler(async (req, res, next) => {

    if (req.body.phone) {
        // encrypt phone
        req.body.phone = await Encrypt({ key: req.body.phone, SECRET_KEY: process.env.SECRET_KEY })
    }
    const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });

    return res.status(201).json({ message: "done", user })
})


// ------------------------------------updatePassword------------------------------------------------------
export const updatePassword = asyncHandler(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body
    // check old password
    if (!await Compare({ key: oldPassword, hashed: req.user.password })) {
        return next(new Error("invalid old password", { cause: 400 }))
    }
    const hash = await Hash({ key: newPassword, SALT_ROUNDS: process.env.SALT_ROUNDS })
    const user = await userModel.findByIdAndUpdate(req.user._id, { password: hash, passwordChangedAt: Date.now() }, { new: true });

    return res.status(201).json({ message: "done", user })
})


// ------------------------------------freezeAccount(soft delete)------------------------------------------------------
export const freezeAccount = asyncHandler(async (req, res, next) => {

    const user = await userModel.findByIdAndUpdate(req.user._id, { isDeleted: true, passwordChangedAt: Date.now() }, { new: true });

    return res.status(201).json({ message: "done", user })
})













