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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const authModel_1 = require("../database/model/authModel");
const workspacemodel_1 = require("../database/model/workspacemodel");
class authRepository {
    findUserExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield authModel_1.User.findOne({ email });
            if (user) {
                return user;
            }
            else {
                return null;
            }
        });
    }
    addNewUser(body, hashedpassowrd, emailToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new authModel_1.User({
                username: body.username,
                email: body.email,
                password: hashedpassowrd,
                phonenumber: body.phonenumber,
                emailToken: emailToken,
            });
            const newUser = yield user.save();
            return newUser;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield authModel_1.User.findOne({ email });
            if (user) {
                return user;
            }
            else {
                return null;
            }
        });
    }
    otpSet(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const setOtp = yield authModel_1.User.findOneAndUpdate({ email }, { $set: { otp: otp } }, { new: true });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield authModel_1.User.findOneAndUpdate({ email }, { $unset: { otp: 1 } });
                    console.log("OTP unset successfully");
                }
                catch (error) {
                    console.error("Error unsetting OTP:", error);
                }
            }), 30000);
            return;
        });
    }
    verification(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield authModel_1.User.findOne({ email });
            return user;
        });
    }
    findOneAndUpdateForgotPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateUser = yield authModel_1.User.findOneAndUpdate({ email }, {
                $set: {
                    password: password
                }
            }, { new: true });
            return updateUser;
        });
    }
    newUserVerifiedTrue(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield authModel_1.User.findOneAndUpdate({ email }, {
                $set: {
                    isVerified: true
                }
            }, { new: true });
            console.log("update", update);
            return update;
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield authModel_1.User.findById(id);
            return user;
        });
    }
    verifyUser(emailToken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("");
            const user = yield authModel_1.User.findOne({ emailToken });
            console.log("user", user);
            if (user) {
                const updateuser = yield authModel_1.User.findOneAndUpdate({ email: user.email }, {
                    $set: {
                        isVerified: true
                    },
                    $unset: { emailToken: 1 }
                });
                console.log("heer");
                return true;
            }
            else {
                return false;
            }
        });
    }
    addTospaceRepository(workpsaceId, email, role, userName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("workpsaceId", workpsaceId, email);
            const result = yield workspacemodel_1.Workspace.updateOne({ _id: workpsaceId }, { $addToSet: { inviteMembers: { email, role, userName, userId } } });
            return true;
        });
    }
}
exports.authRepository = authRepository;
