"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() {
        this.JWT_KEY = process.env.JWT_KEY || " ";
        this.JWT_REFRESHKEY = process.env.JWT_REFRESHKEY || " ";
    }
    generateToken(userId) {
        const accesstoken = jsonwebtoken_1.default.sign({ userId }, this.JWT_KEY);
        return accesstoken;
    }
    generateRefreshToken(userId) {
        const refreshToken = jsonwebtoken_1.default.sign({ userId }, this.JWT_REFRESHKEY);
        return refreshToken;
    }
}
exports.Token = Token;
