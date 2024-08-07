"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "djhfasddfvfefv";
const JWT_REFRESH_SECRET = "jdfhjdfjfd";
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    // console.log("refreshToken", refreshToken);
    // console.log("token", token);
    // console.log("req.cookies", req.cookies);
    // console.log("here1");
    if (!token) {
        // console.log("here2");
        if (!refreshToken) {
            console.log("here3");
            return res.status(401).json({ message: "Access token not provided" });
        }
        else {
            jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
                if (err) {
                    return res
                        .status(403)
                        .json({ message: "Refresh token is not valid" });
                }
                // console.log("here4");
                // console.log("decoded user",user);
                const newAccessToken = jsonwebtoken_1.default.sign({ userId: user.userId }, JWT_SECRET);
                res.cookie("access_token", newAccessToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 3600000,
                });
                console.log("here acces token set", user.userId);
                req.user = user.userId;
                next();
            });
        }
    }
    else {
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Access token is not valid" });
            }
            else {
                // console.log("user",user);
                req.user = user.userId;
                next();
            }
        });
    }
};
exports.default = verifyToken;
