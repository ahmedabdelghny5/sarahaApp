


import bcrypt from "bcrypt"

export const Compare = async ({ key, hashed }) => {
    return bcrypt.compareSync(key, hashed)
}