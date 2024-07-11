"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const otp_generator_1 = require("otp-generator");
function generateOtp() {
    const otp = (0, otp_generator_1.generate)(4, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    return otp;
}
exports.generateOtp = generateOtp;
