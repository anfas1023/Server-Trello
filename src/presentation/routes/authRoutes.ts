import express from "express";
import { authController } from "../controllers/authController";
import { authUsecase } from "../../application/usecase/authUseCase";
import { authRepository } from "../../infrastructure/repository/authRepository";
import { Mailer } from "../../utils/mailer";
import { Token } from "../../utils/token";
import passport from "passport"
import verifyToken from "../../middlewares/verifytoken";
const router = express.Router();

const repository = new authRepository();
const mailer = new Mailer();
const token = new Token();
const auth = new authUsecase(repository, mailer);
const controller = new authController(auth, token);

router.post("/signup",controller.signUpUser.bind(controller))
router.post("/login", controller.loginUser.bind(controller))
// router.post('/signup',(req,res,next)=>controller.signUpUser(req,res,next))
console.log("heer");

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000/login",
    }),
    controller.handleGooglePassport.bind(controller)
  );

  router.get('/github',
  passport.authenticate('github', { scope: ['profile'] }));

  router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: "http://localhost:3000/login" }),
  controller.handleGooglePassport.bind(controller)
);
router.post('/otpverification',controller.verifyOtp.bind(controller))
router.post('/resendotp',controller.handleresendOtP.bind(controller))
router.post('/forgotpassword',controller.forgotPassword.bind(controller))
router.get('/getUserData',controller.getLoggedInUserData.bind(controller))

// image upload and profile route here

router.post('/updateImage',verifyToken,controller.updateImageUrl.bind(controller))
router.post('/updateProfile',verifyToken,controller.updatePeofile.bind(controller));

router.get('/verify',controller.userVerification.bind(controller));


router.get('/logout',controller.onUserLogout.bind(controller));
router.get('/fetchUser',verifyToken,controller.fetchUser.bind(controller));


//   router.get('/google', (req, res, next) => {
//     console.log(req.query); // Log the query parameters
//     passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
//   });
  
  

export default router;
