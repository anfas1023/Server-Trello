import { user } from "../../domain/entities/User";

export interface IAuthUserRepostory {
    findUserExists(email:string) :Promise<user | null>;
    addNewUser(body:user,hashedpassowrd:string,emailToken:string) :Promise<user>;
    findByEmail(email:string) :Promise<user | null>;
    otpSet(otp: string, email: string) :Promise<void>;
    verification(email:string) :Promise<user | null>;
    findOneAndUpdateForgotPassword(email:string,password:string) :Promise<user | null>;
    newUserVerifiedTrue(email:string) :Promise<user | null>;
    findUserById(id:string) :Promise<user | null>; 
    verifyUser(emailToken:string) :Promise<boolean | null>;
    addTospaceRepository(workpsaceId:string,email:string,role:string,userName:string,userId:string):Promise<boolean>
}   


