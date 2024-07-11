import { user } from "../../domain/entities/User";


export interface IauthUseCase {  
    userExists(email:string) :Promise<user | null>;
    registerUser(body:user) : Promise<user>;
    userLogin(email:string,password:string) :Promise<user | null>;
    verifyUser(email:string,otp:string) : Promise<user|null>;
    forgotUsecase(email:string,password:string):Promise<user | null>;
    resendOtp(email:string) : Promise<string>;
    logedUserData(id:string) :Promise<user | null>;
    userVerification(emailToken:string) :Promise<boolean | null>;
    addToSpace(workspaceId:string,email:string,role:string,userName:string,userId:string) :Promise<boolean>;
    fetchUserUseCase(userId:string) :Promise<user |  null>;
}
