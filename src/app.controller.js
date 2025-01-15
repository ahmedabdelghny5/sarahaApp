import cors from "cors";
import connectionDB from './DB/connectionDB.js';
import messageRouter from './modules/messages/message.controller..js';
import userRouter from './modules/users/user.controller.js';
import { globalErrorHandler } from './utils/globalErrorHandling/index.js';



const bootstrap = async (app, express) => {

    // use cors middleware
    app.use(cors());

    // use json middleware for parsing request data
    app.use(express.json());

    // home route
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Hello on sara7a app" })
    })

    // application routes
    app.use("/users", userRouter)
    app.use("/messages", messageRouter)

    // connect to database
    connectionDB()

    // unHandle routes
    app.use("*", (req, res, next) => {
        return next(new Error(`invalid URL ${req.originalUrl}`))
    })

    // global error handler
    app.use(globalErrorHandler)
}

export default bootstrap