"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const GMAIL_USERNAME = process.env.GMAIL_USERNAME || "anfasmuhammed936@gmail.com";
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || "fgck ygso rghz nqwk";
class Mailer {
    sendEmail(to, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: "smtp.gmail.com",
                service: "gmail",
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
            };
            try {
                yield transporter.sendMail(mailOptions);
                return true;
            }
            catch (error) {
                console.error("Error sending email:", error);
                throw error;
            }
        });
    }
}
exports.Mailer = Mailer;
