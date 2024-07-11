"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authUseCase_1 = require("../../application/usecase/authUseCase");
const authRepository_1 = require("../../infrastructure/repository/authRepository");
const mailer_1 = require("../../utils/mailer");
const token_1 = require("../../utils/token");
const passport_1 = __importDefault(require("passport"));
const verifytoken_1 = __importDefault(require("../../middlewares/verifytoken"));
const router = express_1.default.Router();
const repository = new authRepository_1.authRepository();
const mailer = new mailer_1.Mailer();
const token = new token_1.Token();
const auth = new authUseCase_1.authUsecase(repository, mailer);
const controller = new authController_1.authController(auth, token);
router.post("/signup", controller.signUpUser.bind(controller));
router.post("/login", controller.loginUser.bind(controller));
// router.post('/signup',(req,res,next)=>controller.signUpUser(req,res,next))
console.log("heer");
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/auth/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
}), controller.handleGooglePassport.bind(controller));
router.get('/github', passport_1.default.authenticate('github', { scope: ['profile'] }));
router.get('/auth/github/callback', passport_1.default.authenticate('github', { failureRedirect: "http://localhost:3000/login" }), controller.handleGooglePassport.bind(controller));
router.post('/otpverification', controller.verifyOtp.bind(controller));
router.post('/resendotp', controller.handleresendOtP.bind(controller));
router.post('/forgotpassword', controller.forgotPassword.bind(controller));
router.get('/getUserData', controller.getLoggedInUserData.bind(controller));
// image upload and profile route here
router.post('/updateImage', verifytoken_1.default, controller.updateImageUrl.bind(controller));
router.post('/updateProfile', verifytoken_1.default, controller.updatePeofile.bind(controller));
router.get('/verify', controller.userVerification.bind(controller));
router.get('/logout', controller.onUserLogout.bind(controller));
router.get('/fetchUser', verifytoken_1.default, controller.fetchUser.bind(controller));
//   router.get('/google', (req, res, next) => {
//     console.log(req.query); // Log the query parameters
//     passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
//   });
exports.default = router;
