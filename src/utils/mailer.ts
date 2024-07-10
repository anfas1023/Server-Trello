import nodemailer from 'nodemailer'

const GMAIL_USERNAME = process.env.GMAIL_USERNAME || "anfasmuhammed936@gmail.com"
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || "fgck ygso rghz nqwk"

export class Mailer {
    async sendEmail(to: string, data: any) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service:"gmail",
            port: 587,
            secure: true,
            auth: {
                user: GMAIL_USERNAME,
                pass: GMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: GMAIL_USERNAME,
            to: to,
            subject: "Verification Message",
            html: data, 
        }

        try {
            await transporter.sendMail(mailOptions);   
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            throw error; 
        }
    }
}
