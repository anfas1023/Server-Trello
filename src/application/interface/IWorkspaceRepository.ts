import { UpdateWriteOpResult } from "mongoose";
import { User } from "../../domain/entities/User";
import { workspace } from "../../domain/entities/workspace"
export interface IWorkspaceRepository {
    registerWorkspace(workspacename:string,userId:string,description:string,workspaceOwner:string,username:string,email:string):Promise<workspace>
    findWorkspaceByUserId(userId:string) :Promise<workspace[] | null>;
    findAllUser() :Promise<User[]| null>
    workspaceNameExist(workspaceName:string) : Promise<workspace | null>
    findInvitedMemberEmail(userId:string) :Promise<User | null>;
    userExistOnWorkspace(email:string,workspaceId:string) :Promise<workspace| null>;
    userExist(email:string) :Promise<User | null>;  
    addUserToSpace(email:string,workspaceId:string) :Promise<workspace| null>;
}