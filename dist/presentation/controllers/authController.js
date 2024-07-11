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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authModel_1 = require("../../infrastructure/database/model/authModel");
class authController {
    constructor(authUsecase, token) {
        this.authUsecase = authUsecase;
        this.token = token;
    }
    signUpUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, workpsaceId, role } = req.body;
                const existinguser = yield this.authUsecase.userExists(email);
                console.log("controller");
                if (existinguser) {
                    return res.status(401).json({ message: "user already exists" });
                }
                else {
                    if (workpsaceId && role) {
                        const userData = yield this.authUsecase.registerUser(req.body);
                        const addToSpace = yield this.authUsecase.addToSpace(workpsaceId, email, role, username, userData._id);
                        return res.status(201).json(userData);
                    }
                    const userData = yield this.authUsecase.registerUser(req.body);
                    return res.status(201).json(userData);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authUsecase.userLogin(req.body.email, req.body.password);
                // console.log(user);
                if (user === null || user === void 0 ? void 0 : user.isVerified) {
                    if (user === null || user === void 0 ? void 0 : user._id) {
                        const token = this.token.generateToken(user._id);
                        const refreshToken = this.token.generateRefreshToken(user._id);
                        res.cookie("access_token", token, {
                            httpOnly: true,
                            sameSite: "none",
                            secure: true,
                            maxAge: 3600000,
                        });
                        res.cookie("refresh_token", refreshToken, {
                            httpOnly: true,
                            sameSite: "none",
                            secure: true,
                            maxAge: 5 * 24 * 60 * 60 * 1000,
                        });
                        const { password } = user, rest = __rest(user, ["password"]);
                        console.log("user", user);
                        let userData = {
                            userId: user._id,
                            username: user.username,
                            email: user.email,
                            token: token,
                        };
                        // const userdata={
                        // }
                        // console.log("rest", rest._doc);
                        console.log(user);
                        return res.status(200).json(userData);
                    }
                    else {
                        res.status(401).json({ error: "email Is Not Found plz signUp" });
                    }
                }
                else {
                    res.status(401).json({
                        error: "User Is not Verified",
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const verify = yield this.authUsecase.verifyUser(email, otp);
                if (verify) {
                    return res.status(200).json({ message: "OTP verification sucessfull" });
                }
                else {
                    res.status(400).json({ error: "Incorrect Otp" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    handleGooglePassport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    // console.log("google", req.user);
                    // const email1 = req.user._json.email;
                    // console.log("email1", email1);
                    // console.log("req.user",req.user)
                    const user = req.user;
                    const email = user.emails[0].value;
                    const existinguser = yield this.authUsecase.userExists(email);
                    let token;
                    let refreshToken;
                    if (existinguser) {
                        console.log("existing user");
                        token = this.token.generateToken(existinguser._id);
                    }
                    else {
                        const userData = {
                            id: user.id,
                            username: user.displayName,
                            email: user.emails[0].value,
                            password: user.id,
                            profilePhoto: user.photos[0].value,
                            role: "owner",
                        };
                        if (!userData.username) {
                            userData.username = user.username;
                        }
                        const registeruser = yield this.authUsecase.registerUser(userData);
                        console.log(registeruser);
                        if (registeruser) {
                            token = this.token.generateToken(registeruser._id);
                            refreshToken = this.token.generateRefreshToken(registeruser._id);
                        }
                    }
                    if (token) {
                        res.cookie("access_token", token, {
                            httpOnly: true,
                            sameSite: "none",
                            secure: true,
                            maxAge: 3600000,
                        });
                        return res.redirect(`http://localhost:3000/dashboard`);
                    }
                }
            }
            catch (error) {
                console.log(error);
                // Handle error
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, email } = req.body;
                const existingUser = yield this.authUsecase.userExists(email);
                if (existingUser) {
                    const data = yield this.authUsecase.forgotUsecase(email, password);
                    console.log("DATA", data);
                    return res
                        .status(201)
                        .json({ message: "password Updated Sucessfully", data });
                }
                else {
                    return res.status(401).json({ error: "User doesnt Exits" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    handleresendOtP(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const existingUser = yield this.authUsecase.userExists(email);
                if (existingUser) {
                    const otp = yield this.authUsecase.resendOtp(email);
                    console.log(otp);
                    return res
                        .status(200)
                        .json({ message: "resend otp sended sucessfully" });
                }
                else {
                    return res.status(400).json({ message: "user doesnt exist" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getLoggedInUserData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.user;
            console.log(id);
            const userData = yield this.authUsecase.logedUserData(id);
        });
    }
    userVerification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.query;
            console.log("query", req.query);
            const userVerified = yield this.authUsecase.userVerification(token);
            return res.redirect(`${process.env.FRONTEND_URL}/login`);
        });
    }
    updateImageUrl(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { imageUrl, userId } = req.body;
                console.log("body", req.body);
                const updateImageUrl = yield authModel_1.User.findByIdAndUpdate(userId, {
                    $set: {
                        profilePhoto: imageUrl,
                    },
                });
                if (updateImageUrl) {
                    return res.status(201).json(updateImageUrl);
                }
                else {
                    return res.status(400).json({ error: "Image Cannot been updated" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updatePeofile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, userId } = req.body;
                console.log("body", req.body);
                const updateUserName = yield authModel_1.User.findByIdAndUpdate(userId, {
                    $set: {
                        username: username,
                    },
                });
                if (updateUserName) {
                    return res.status(201).json(updateUserName);
                }
                else {
                    return res.status(400).json({ error: "username cannat been updated" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    onUserLogout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("access_token");
                res.clearCookie("refresh_token");
                // Optionally, set the cookies to expire immediately if they still exist
                res.cookie("access_token", "", {
                    expires: new Date(0),
                    httpOnly: true,
                    sameSite: "none",
                });
                res.cookie("refresh_token", "", {
                    expires: new Date(0),
                    httpOnly: true,
                    sameSite: "none",
                });
                return res.status(200).json({ message: "Logged out successfully" });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userDtaFetchUsre", req.user);
            if (!req.user) {
                return res.status(401).json({ error: "Token not founded" });
            }
            const userId = req.user;
            const user = yield this.authUsecase.fetchUserUseCase(userId);
            const userData = {
                username: user === null || user === void 0 ? void 0 : user.username,
                email: user === null || user === void 0 ? void 0 : user.email,
                userId: user === null || user === void 0 ? void 0 : user._id,
            };
            console.log("userData", userData);
            return res.status(200).json(userData);
        });
    }
}
exports.authController = authController;
