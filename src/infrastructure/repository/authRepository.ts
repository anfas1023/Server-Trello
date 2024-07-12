import { User } from "../database/model/authModel";
import { IAuthUserRepostory } from "../../application/interface/IAuthUserRepostory";
import { Workspace } from "../database/model/workspacemodel";
import {user} from '../../domain/entities/User'

export class authRepository implements IAuthUserRepostory {
  async findUserExists(email: string) : Promise<user | null> {
    const user = await User.findOne({ email });
    if (user) {
      return user;
    } else {
      return null;
    }
  }
  async addNewUser(body: any, hashedpassowrd: string, emailToken: string) :Promise<user> {
    const user = new User({
      username: body.username,
      email: body.email,
      password: hashedpassowrd,
      phonenumber: body.phonenumber,
      emailToken: emailToken,
    });
    const newUser = await user.save();

    return newUser;
  }

  async findByEmail(email: string) :Promise<user | null> {
    const user = await User.findOne({ email });
    if (user) {
      return user;
    } else {
      return null;
    }
  }
  async otpSet(email: string, otp: string) : Promise<void> {
    const setOtp = await User.findOneAndUpdate(
      { email },
      { $set: { otp: otp } },
      { new: true }
    );

    setTimeout(async () => {
      try {
        await User.findOneAndUpdate({ email }, { $unset: { otp: 1 } });
        console.log("OTP unset successfully");
      } catch (error) {
        console.error("Error unsetting OTP:", error);
      }
    }, 30000);

    return;
  }

  async verification(email: string) : Promise<user | null> {
    const user = await User.findOne({ email });
    return user;
  }

  async findOneAndUpdateForgotPassword(email: string, password: string):Promise<user | null> {
    const updateUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          password: password,
        },
      },
      { new: true }
    );

    return updateUser;
  }

  async newUserVerifiedTrue(email: string) : Promise<user | null> {
    const update = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          isVerified: true,
        },
      },
      { new: true }
    );

    return update;
  }
  async findUserById(id: string) :Promise<user | null> {
    const user = await User.findById(id);
    return user;
  }

  async verifyUser(emailToken: string) :Promise<boolean | null> {
 
    const user = await User.findOne({ emailToken });
    console.log("user", user);
    if (user) {
      const updateuser = await User.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            isVerified: true,
          },
          $unset: { emailToken: 1 },
        }
      );

      return true;
    } else {
      return false;
    }
  }

  async addTospaceRepository(
    workpsaceId: string,
    email: string,
    role: string,
    userName: string,
    userId: string
  ) : Promise<boolean> {  


    const result = await Workspace.updateOne(
      { _id: workpsaceId },
      { $addToSet: { inviteMembers: { email, role, userName, userId } } }
    );

    return true;
  }
}
