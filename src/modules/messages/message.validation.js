import joi from "joi"
import { generalRules } from "../../utils/index.js"

export const sendMessageSchema = {
    body: joi.object({
        content: joi.string().min(1).max(100).required(),
        userId: generalRules.id.required(),
    }).required()
}
