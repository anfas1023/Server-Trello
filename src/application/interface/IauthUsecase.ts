import { User } from "../../domain/entities/User";


export interface IauthUseCase {  
    userExists(email:string) :Promise<User | null>;
    registerUser(body:User) : Promise<User>;
    userLogin(email:string,password:string) :Promise<User | null>;
    verifyUser(email:string,otp:string) : Promise<User|null>;
    forgotUsecase(email:string,password:string):Promise<User | null>;
    resendOtp(email:string) : Promise<string>;
    logedUserData(id:string) :Promise<User | null>;
    userVerification(emailToken:string) :Promise<boolean | null>;
    addToSpace(workspaceId:string,email:string,role:string,userName:string,userId:string) :Promise<boolean>;
    fetchUserUseCase(userId:string) :Promise<User |  null>;
}
