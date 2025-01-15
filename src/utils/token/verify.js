

import jwt from "jsonwebtoken"

export const Verify = async ({ token, SIGNATURE }) => {
    return jwt.verify(token, SIGNATURE)
} 