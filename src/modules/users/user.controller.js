import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { authentication, authorization, roles } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";




const userRouter = Router()

userRouter.post("/signup", validation(UV.signUpSchema), US.signup)
userRouter.get("/confirmEmail/:token", US.confirmEmail)
userRouter.post("/signin", validation(UV.signInSchema), US.signin)
userRouter.get("/profile", authentication, US.getProfile)
userRouter.get("/profile/:id", validation(UV.shareProfileSchema), US.shareProfile)
userRouter.patch("/update", validation(UV.updateProfileSchema), authentication, US.updateProfile)
userRouter.patch("/update/password", validation(UV.updatePasswordSchema), authentication, US.updatePassword)
userRouter.delete("/freezeAccount", validation(UV.freezeAccount), authentication, US.freezeAccount)



export default userRouter