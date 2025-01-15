import mongoose from "mongoose"

const connectionDB = async () => {
    await mongoose.connect(process.env.URI_ONLINE)
        .then(() => {
            console.log(`Connected to DB on URI ${process.env.URI_ONLINE}`)
        })
        .catch((err) => {
            console.log("Error connecting to DB", err)
        })
}

export default connectionDB;