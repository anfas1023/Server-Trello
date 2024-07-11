import mongoose,{Schema,Document} from "mongoose"

interface UserDocument extends Document{
    _id:string
    username:string;
    email:string;
    password:string;
    profilePhoto?: string;  
    otp:string;
    phonenumber:string;
    isVerified:boolean;
    emailToken:string;
}
const UserSchema=new Schema<UserDocument>({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    profilePhoto:{type:String,required:false},
    otp:{type:String,required:false},
    phonenumber:{type:String,required:false},
    isVerified:{type:Boolean,required:false,default:false},
    emailToken:{type:String,required:false},
})

export const User=mongoose.model<UserDocument>("User",UserSchema);