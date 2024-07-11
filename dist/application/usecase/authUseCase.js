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
exports.authUsecase = void 0;
const generateOTP_1 = require("../../utils/generateOTP");
const emailtemplate_1 = __importDefault(require("../../utils/emailtemplate"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
class authUsecase {
    constructor(repository, mailer) {
        this.repository = repository;
        this.mailer = mailer;
    }
    userExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findUserExists(email);
            return user;
        });
    }
    registerUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("usecase");
            const emailToken = crypto_1.default.randomBytes(64).toString("hex");
            const hashedPassword = bcrypt_1.default.hashSync(body.password, 10);
            const registeredUser = yield this.repository.addNewUser(body, hashedPassword, emailToken);
            const verificationLink = `${process.env.BACKEND_URL}/verify?token=${emailToken}`;
            console.log("emailToken", emailToken);
            console.log("verificationLink", verificationLink);
            const otp = (0, generateOTP_1.generateOtp)();
            const htmlTemplate = (0, emailtemplate_1.default)(verificationLink);
            yield this.mailer.sendEmail(registeredUser.email, htmlTemplate);
            yield this.repository.otpSet(registeredUser.email, otp);
            console.log("mail compeleted");
            return registeredUser;
        });
    }
    userLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findByEmail(email);
            if (!user) {
                return null;
            }
            if (user.password) {
                const validPassword = bcrypt_1.default.compareSync(password, user.password);
                if (validPassword) {
                    return user;
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        });
    }
    verifyUser(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifiedUser = yield this.repository.verification(email);
            if (verifiedUser) {
                if (verifiedUser.otp === otp) {
                    console.log("verifiedUser", verifiedUser);
                    const userIsVerified = yield this.repository.newUserVerifiedTrue(email);
                    console.log("OTp verification sucessfull");
                    return userIsVerified;
                }
            }
            else {
                return null;
            }
            return null;
        });
    }
    forgotUsecase(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = bcrypt_1.default.hashSync(password, 10);
            const updatedPasswordData = yield this.repository.findOneAndUpdateForgotPassword(email, hashedPassword);
            const otp = (0, generateOTP_1.generateOtp)();
            const htmlTemplate = (0, emailtemplate_1.default)(otp);
            yield this.repository.otpSet(email, otp);
            yield this.mailer.sendEmail(email, htmlTemplate);
            return updatedPasswordData;
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = (0, generateOTP_1.generateOtp)();
            const htmlTemplate = (0, emailtemplate_1.default)(otp);
            yield this.repository.otpSet(email, otp);
            yield this.mailer.sendEmail(email, htmlTemplate);
            return otp;
        });
    }
    logedUserData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedData = yield this.repository.findUserById(id);
            return loggedData;
        });
    }
    userVerification(emailToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerified = yield this.repository.verifyUser(emailToken);
            return true;
        });
    }
    addToSpace(workspaceId, email, role, userName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const addToSpace = yield this.repository.addTospaceRepository(workspaceId, email, role, userName, userId);
            return true;
        });
    }
    fetchUserUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findUserById(userId);
            return user;
        });
    }
}
exports.authUsecase = authUsecase;
