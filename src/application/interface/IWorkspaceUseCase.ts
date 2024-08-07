import { UpdateWriteOpResult } from "mongoose"
import { user } from "../../domain/entities/User"
import { workspace } from "../../domain/entities/workspace"

export interface IWorkspaceUseCase{
    createWorkspaceUseCase(workspacename:string,userId:string,description:string,workspace_owner:string,username:string,email:string):Promise<workspace | null>
    getAllWorkspaceUsecase(userId:string) :Promise<workspace[] | null>
    inviteUser() :Promise<user[]| null>
    workspaceNameExist(workspaceName:string) :Promise <workspace | null>;
    sendVerificationMail(email:string,workpsaceId:string) :Promise<boolean>;
    findInvitedUser(userId:string) :Promise<user | null>;
    chechUserExistOnWorkspace(email:string,workpsaceId:string) :Promise<workspace | null >;
    userExist(email:string) :Promise<user | null>;
    sendVerificationMailToExistingUser(email:string,workspaceId:string) :Promise<boolean>;
    addToSpaceUsecase(email:string,workspaceId:string) :Promise<workspace | null >
}