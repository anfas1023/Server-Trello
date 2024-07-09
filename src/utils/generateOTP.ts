import { generate } from "otp-generator";

export function generateOtp() : string {
  const otp=generate(4,{digits:true,upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false});
  return otp;
}
