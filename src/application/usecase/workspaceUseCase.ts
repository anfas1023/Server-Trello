import { IMailer } from "../interface/IMailer";
import { IWorkspaceRepository } from "../interface/IWorkspaceRepository";
import { IWorkspaceUseCase } from "../interface/IWorkspaceUseCase";
import crypto from "crypto";
import inviteUserTemplate from "../../utils/inviteUserTemplate";

export class WorkspaceUseCase implements IWorkspaceUseCase {
  private workspaceRepository;
  private mailer: IMailer;
  constructor(workspaceRepository: IWorkspaceRepository, mailer: IMailer) {
    this.workspaceRepository = workspaceRepository;
    this.mailer = mailer;
  }
  async createWorkspaceUseCase(
    workspacename: string,
    userId: string,
    description: string,
    workspaceOwner: string,
    username:string,
    email:string
  ) {
    const workspace = await this.workspaceRepository.registerWorkspace(
      workspacename,
      userId,
      description,
      workspaceOwner,
      username,
      email
    );

    return workspace;
  }

  async workspaceNameExist(workspaceName: string) {
    const nameExist = await this.workspaceRepository.workspaceNameExist(
      workspaceName
    );
    if (nameExist) {
      return nameExist;
    } else {
      return null;
    }
  }

  async getAllWorkspaceUsecase(userId: string) {
    const allWorkspace = await this.workspaceRepository.findWorkspaceByUserId(
      userId
    );
    // console.log("allWorkspace",allWorkspace);

    return allWorkspace;
  }

  async inviteUser() {
    const allUser = await this.workspaceRepository.findAllUser();

    if (allUser) {
      return allUser;
    } else {
      return null;
    }
  }

  async sendVerificationMail(email: string, workspaceId: string) {
    // const emailToken = crypto.randomBytes(64).toString('hex');
    const verificationLink = `${process.env.FRONTEND_URL}/employee-login?email=${email}&workspaceId=${workspaceId}`;
    const htmlTemplate = inviteUserTemplate(verificationLink);
    await this.mailer.sendEmail(email, htmlTemplate);
    console.log("mail sended to invited user");
    return true;
  }

  async sendVerificationMailToExistingUser(email:string,workspaceId:string){
    const verifiationLink=`${process.env.BACKEND_URL}/workspace/addTOWorkspace?email=${email}&workspaceId=${workspaceId}`;
    const htmlTemplate = inviteUserTemplate(verifiationLink);
    await this.mailer.sendEmail(email,htmlTemplate);
    console.log("on existing user");
    return true
  }

  async findInvitedUser(userId: string) {
    return await this.workspaceRepository.findInvitedMemberEmail(userId);
  }

  async chechUserExistOnWorkspace(email: string, workpsaceId: string) {
    const user = await this.workspaceRepository.userExistOnWorkspace(
      email,
      workpsaceId
    );
    return user;
  }

  async userExist(email:string){
    return await this.workspaceRepository.userExist(email);
  }
  async addToSpaceUsecase(email:string,workspaceId:string){
   const workpsace=await this.workspaceRepository.addUserToSpace(email,workspaceId)
   console.log("addTospaceUsecas");
   
   return workpsace
  }
}
