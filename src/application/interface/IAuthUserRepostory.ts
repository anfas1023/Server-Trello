import { User } from "../../domain/entities/User";

export interface IAuthUserRepostory {
    findUserExists(email:string) :Promise<User | null>;
    addNewUser(body:User,hashedpassowrd:string,emailToken:string) :Promise<User>;
    findByEmail(email:string) :Promise<User | null>;
    otpSet(otp: string, email: string) :Promise<void>;
    verification(email:string) :Promise<User | null>;
    findOneAndUpdateForgotPassword(email:string,password:string) :Promise<User | null>
    newUserVerifiedTrue(email:string) :Promise<User | null>
    findUserById(id:string) :Promise<User | null>; 
    verifyUser(emailToken:string) :Promise<boolean | null>;
    addTospaceRepository(workpsaceId:string,email:string,role:string,userName:string,userId:string):Promise<boolean>
}


