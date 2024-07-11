import { IauthUseCase } from "../interface/IauthUsecase";
import { IAuthUserRepostory } from "../interface/IAuthUserRepostory";
import { user } from "../../domain/entities/User";
import { generateOtp } from "../../utils/generateOTP";
import { IMailer } from "../interface/IMailer";
import generateEmailTemplate from "../../utils/emailtemplate";
import bcrypt from "bcrypt";
import { IToken } from "../interface/IToken";
import crypto from "crypto";

export class authUsecase implements IauthUseCase {
  private repository: IAuthUserRepostory;
  private mailer: IMailer;
  constructor(repository: IAuthUserRepostory, mailer: IMailer) {
    this.repository = repository;
    this.mailer = mailer;
  }

  async userExists(email: string): Promise<user | null> {
    const user = await this.repository.findUserExists(email);
    return user;
  }

  async registerUser(body: user): Promise<user> {
    // console.log("usecase");
    const emailToken = crypto.randomBytes(64).toString("hex");
    const hashedPassword = bcrypt.hashSync(body.password, 10);

    const registeredUser = await this.repository.addNewUser(
      body,
      hashedPassword,
      emailToken
    );

    const verificationLink = `${process.env.BACKEND_URL}/verify?token=${emailToken}`;
    console.log("emailToken", emailToken);
    console.log("verificationLink", verificationLink);

    const otp = generateOtp();
    const htmlTemplate = generateEmailTemplate(verificationLink);

    await this.mailer.sendEmail(registeredUser.email, htmlTemplate);
    await this.repository.otpSet(registeredUser.email, otp);

    console.log("mail compeleted");

    return registeredUser;
  }
  async userLogin(email: string, password: string) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      return null;
    }

    if (user.password) {
      const validPassword = bcrypt.compareSync(password, user.password);

      if (validPassword) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async verifyUser(email: string, otp: string) {
    const verifiedUser = await this.repository.verification(email);

    if (verifiedUser) {
      if (verifiedUser.otp === otp) {
        console.log("verifiedUser", verifiedUser);

        const userIsVerified = await this.repository.newUserVerifiedTrue(email);
        console.log("OTp verification sucessfull");
        return userIsVerified;
      }
    } else {
      return null;
    }

    return null;
  }

  async forgotUsecase(email: string, password: string) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const updatedPasswordData =
      await this.repository.findOneAndUpdateForgotPassword(
        email,
        hashedPassword
      );
    const otp = generateOtp();
    const htmlTemplate = generateEmailTemplate(otp);
    await this.repository.otpSet(email, otp);
    await this.mailer.sendEmail(email, htmlTemplate);
    return updatedPasswordData;
  }

  async resendOtp(email: string) {
    const otp = generateOtp();
    const htmlTemplate = generateEmailTemplate(otp);
    await this.repository.otpSet(email, otp);
    await this.mailer.sendEmail(email, htmlTemplate);
    return otp;
  }

  async logedUserData(id: string) {
    const loggedData = await this.repository.findUserById(id);
    return loggedData;
  }

  async userVerification(emailToken: string) {
    const userVerified = await this.repository.verifyUser(emailToken);
    return true;
  }

  async addToSpace(workspaceId: string, email: string,role:string,userName:string,userId:string) {
    const addToSpace = await this.repository.addTospaceRepository(
      workspaceId,
      email,
      role,
      userName,
      userId
    );
    return true;
  }

  async fetchUserUseCase(userId:string){
    const user=await this.repository.findUserById(userId)
    return user
  }
}
