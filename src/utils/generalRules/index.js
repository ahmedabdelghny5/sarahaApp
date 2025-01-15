import joi from "joi"
import { Types } from "mongoose"


const idValidation = (value, helper) => {
    const isValidId = Types.ObjectId.isValid(value)
    return isValidId ? value : helper.message(`Invalid id: ${value}`)
}


export const generalRules = {
    email: joi.string().email({ tlds: { allow: true }, minDomainSegments: 2, maxDomainSegments: 2 }),
    password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    id: joi.string().custom(idValidation),
    headers: joi.object({
        authorization: joi.string().required(),
        'cache-control': joi.string(),
        'postman-token': joi.string(),
        'content-type': joi.string(),
        'content-length': joi.string(),
        host: joi.string(),
        'user-agent': joi.string(),
        accept: joi.string(),
        'accept-encoding': joi.string(),
        connection: joi.string(),
    }),
}


