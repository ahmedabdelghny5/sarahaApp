
import { EventEmitter } from 'events';
import { sendEmail } from '../../service/sendEmails.js';
import { generateToken } from '../token/generateToken.js';

export const eventEmitter = new EventEmitter()



eventEmitter.on("sendEmail", async (data) => {
    // // send email notification
    const { email } = data;
    const token = await generateToken({
        payload: { email },
        SIGNATURE: process.env.EMAIL_CONFIRMATION_SIGNATURE,
        option: { expiresIn: "10m" }
    })
    const link = `http://localhost:${process.env.PORT}/users/confirmEmail/${token}`;

    await sendEmail(email, "confirm email", `<a href='${link}'>Confirm Me</a>`)

})