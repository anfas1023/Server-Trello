"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID || " ",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || " ",
    callbackURL: 'http://localhost:5000/auth/github/callback',
    scope: ['user:email']
}, function (accessToken, refreshToken, profile, done) {
    done(null, profile);
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
