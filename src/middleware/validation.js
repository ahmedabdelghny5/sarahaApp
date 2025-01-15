import userModel from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/globalErrorHandling/index.js";




export const validation = (schema) => {
    return asyncHandler(async (req, res, next) => {

        const errorResults = [];
        for (const key of Object.keys(schema)) {
            const data = schema[key].validate(req[key], { abortEarly: false })
            if (data?.error) {
                errorResults.push(data.error.details)
            }
        }
        if (errorResults.length > 0) {
            return res.status(400).json({ message: "validation error", errors: errorResults })
        }
        next()
    })
}

