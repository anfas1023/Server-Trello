import { NextFunction, Request, Response } from "express";
import { IauthUseCase } from "../../application/interface/IauthUsecase";
import { IToken } from "../../application/interface/IToken";
import { error } from "console";
import { User } from "../../infrastructure/database/model/authModel";

export class authController {
  private authUsecase: IauthUseCase;
  private token: IToken;
  constructor(authUsecase: IauthUseCase, token: IToken) {
    this.authUsecase = authUsecase;
    this.token = token;
  }

  async signUpUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password, workpsaceId, role } = req.body;

      const existinguser = await this.authUsecase.userExists(email);

      // console.log("controller");

      console.log("workpsaceId",workpsaceId,role,"role");
      

      if (existinguser) {
        return res.status(401).json({ message: "user already exists" });
      } else {
        if (workpsaceId && role) {
          const userData = await this.authUsecase.registerUser(req.body);
          const addToSpace = await this.authUsecase.addToSpace(
            workpsaceId,
            email,
            role,
            username,
            userData._id as string
          );
          return res.status(201).json(userData);
        }
        const userData = await this.authUsecase.registerUser(req.body);
        return res.status(201).json(userData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {  
      // console.log("req.body.email",req.body.email,req.body.password);
      
      const user = await this.authUsecase.userLogin(
        req.body.email,
        req.body.password
      );
      console.log("user",user);

      if (user?.isVerified) {
        if (user?._id) {
          const token = this.token.generateToken(user._id);
          const refreshToken = this.token.generateRefreshToken(user._id);
          // console.log("token-login",token,refreshToken);
          
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
          const { password, ...rest } = user;
          // console.log("user",user);
          
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
        } else {
          res.status(401).json({ error: "email Is Not Found plz signUp" });
        }
      } else {
        res.status(401).json({
          error: "User Is not Verified",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      const verify = await this.authUsecase.verifyUser(email, otp);
      if (verify) {
        return res.status(200).json({ message: "OTP verification sucessfull" });
      } else {
        res.status(400).json({ error: "Incorrect Otp" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async handleGooglePassport(req: any, res: any) {
    try {
      if (req.user) {
        // console.log("google", req.user);
        // const email1 = req.user._json.email;
        // console.log("email1", email1);

        // console.log("req.user",req.user)

        const user = req.user;
        const email = user.emails[0].value;

        const existinguser = await this.authUsecase.userExists(email);
        let token;
        let refreshToken;
        if (existinguser) {
          console.log("existing user");
          token = this.token.generateToken(existinguser._id as string);
        } else {
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

          const registeruser = await this.authUsecase.registerUser(userData);
          console.log(registeruser);

          if (registeruser) {
            token = this.token.generateToken(registeruser._id as string);
            refreshToken = this.token.generateRefreshToken(
              registeruser._id as string
            );
          }
        }
        if (token) {
          res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 3600000,
          });
          return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
        }
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, email } = req.body;

      const existingUser = await this.authUsecase.userExists(email);

      if (existingUser) {
        const data = await this.authUsecase.forgotUsecase(email, password);
        console.log("DATA", data);
        return res
          .status(201)
          .json({ message: "password Updated Sucessfully", data });
      } else {
        return res.status(401).json({ error: "User doesnt Exits" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async handleresendOtP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const existingUser = await this.authUsecase.userExists(email);
      if (existingUser) {
        const otp = await this.authUsecase.resendOtp(email);
        console.log(otp);
        return res
          .status(200)
          .json({ message: "resend otp sended sucessfully" });
      } else {
        return res.status(400).json({ message: "user doesnt exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getLoggedInUserData(req: Request, res: Response, next: NextFunction) {
    const id = req.user;
    console.log(id);
    const userData = await this.authUsecase.logedUserData(id as string);
  }

  async userVerification(req: Request, res: Response, next: NextFunction) {
    const { token } = req.query;
    console.log("query", req.query);

    const userVerified = await this.authUsecase.userVerification(
      token as string
    );
    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  }

  async updateImageUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageUrl, userId } = req.body;

      console.log("body", req.body);

      const updateImageUrl = await User.findByIdAndUpdate(userId, {
        $set: {
          profilePhoto: imageUrl,
        },
      });
      if (updateImageUrl) {
        return res.status(201).json(updateImageUrl);
      } else {
        return res.status(400).json({ error: "Image Cannot been updated" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updatePeofile(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, userId } = req.body;

      console.log("body", req.body);

      const updateUserName = await User.findByIdAndUpdate(userId, {
        $set: {
          username: username,
        },
      });

      if (updateUserName) {
        return res.status(201).json(updateUserName);
      } else {
        return res.status(400).json({ error: "username cannat been updated" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onUserLogout(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
      console.log(error);
    }
  }

  async fetchUser(req: Request, res: Response, next: NextFunction) {
    console.log("userDtaFetchUsre",req.user);

    if (!req.user) {
      return res.status(401).json({ error: "Token not founded" });
    }

    const userId = req.user;

    const user = await this.authUsecase.fetchUserUseCase(userId as string);
    const userData = {
      username: user?.username,
      email: user?.email,
      userId: user?._id,
    };
    console.log("userData",userData);
    
    return res.status(200).json(userData);
  }
}
