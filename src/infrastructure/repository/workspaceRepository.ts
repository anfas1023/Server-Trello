import { NextFunction, Request, Response } from "express";
import { Workspace } from "../database/model/workspacemodel";
import { IWorkspaceRepository } from "../../application/interface/IWorkspaceRepository";
import { User } from "../database/model/authModel";

export class WorkspaceRepository implements IWorkspaceRepository {
  async registerWorkspace(
    workspacename: string,
    userId: string,
    description: string,
    workspaceOwner: string,
    username:string,
    email:string,
  ) {

    // console.log("username",username,email,userId,workspaceOwner);
    
    const newWorkspace = new Workspace({
      workspacename: workspacename,
      userId: userId,
      description: description,
      workspaceOwner: {
        userName:username,
        email:email,
        ownerId:userId,
        role:"owner"
      },

    });

    await newWorkspace.save();

    return newWorkspace;
  }

  async findWorkspaceByUserId(userId: string) {
    const allWorkspace = await Workspace.find({ userId: userId });

    return allWorkspace;
  }

  async workspaceNameExist(workspaceName: string) {
    // console.log(workspaceName);

    const workspace = await Workspace.findOne({ workspacename: workspaceName });
    console.log("workspace", workspace);

    if (
      workspace &&
      workspace.workspacename.toUpperCase() === workspaceName.toUpperCase()
    ) {
      return workspace;
    }

    return workspace ? workspace : null;
  }

  async findAllUser() {
    const allUser = await User.find();
    if (allUser) {
      return allUser;
    } else {
      return null;
    }
  }


  async findInvitedMemberEmail(userId:string){
   const user=await User.findById(userId);
   return user
  }

  async userExistOnWorkspace(email:string,workspaceId:string){
    const userExists = await Workspace.findOne({
      _id: workspaceId,
      inviteMembers: { $elemMatch: { email: email } }
  });
  return userExists
  }

  async userExist(email:string){
    const user=await User.findOne({email:email})
    return user
  }

  async  addUserToSpace(email:string, workspaceId:string) {
    try {
        const user = await User.findOne({ email });
        const role = "member";
        console.log("addUserToSpace");
        console.log("email",email,workspaceId,"workspaceId");
        

        const result = await Workspace.findOneAndUpdate(
            { _id: workspaceId },
            { $push: { inviteMembers: { email, role, userId: user?._id, userName: user?.username } } },
            { new: true }
        );

        console.log("result", result);

        return result;
    } catch (error) {
        console.error("Error adding user to space:", error);
        throw error;
    }
}


 
}
