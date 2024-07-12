import { NextFunction, Request, Response } from "express";
import { IWorkspaceUseCase } from "../../application/interface/IWorkspaceUseCase";
import { User } from "../../infrastructure/database/model/authModel";
// import { error } from "console";
import { Workspace } from "../../infrastructure/database/model/workspacemodel";
import { error } from "console";

export class WorkspaceController {
  private workspaceusecase;
  constructor(workspaceusecase: IWorkspaceUseCase) {
    this.workspaceusecase = workspaceusecase;
  }
  async createWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspacename, userId, description, workspaceOwner,username,email } = req.body;
      // console.log(req.body);

      const sameNameExist = await this.workspaceusecase.workspaceNameExist(
        workspacename
      );

      if (sameNameExist) {
        return res.status(400).json({ error: "Workspace Name exist" });
      } else {
        const workspace = await this.workspaceusecase.createWorkspaceUseCase(
          workspacename,
          userId,
          description,
          workspaceOwner,
          username,
          email
        );

        // console.log("workspace",workspace);

        if (workspace) {
          return res.status(201).json(workspace);
        } else {
          return res
            .status(400)
            .json({ error: "Workspcae Cannot bben created" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getAllWorkspcae(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

   

      const userId = req.user;

      const getAllWorkspace =
        await this.workspaceusecase.getAllWorkspaceUsecase(userId as string);
    

      if (getAllWorkspace) {
        return res.status(200).json(getAllWorkspace);
      } else {
        return res
          .status(400)
          .json({ error: "No Workspcae Found By that User" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async inviteUser(req: Request, res: Response, next: NextFunction) {
    const allUsers = await this.workspaceusecase.inviteUser();

    if (allUsers) {
      return res.status(200).json(allUsers);
    } else {
      return res.status(400).json({ Error: "No User avilable" });
    }
  }

  async searchUserToAddWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { query } = req.params;

    const searchedResult = await User.find({
      email: { $regex: query, $options: "i" },
    });



    if (searchedResult) {
      return res.status(200).json(searchedResult);
    } else {
      return res.status(200).json({ error: "No User Available" });
    }
  }

  async addMemenersToWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { workspaceId, emails } = req.body;

    const result = await Workspace.updateOne(
      { _id: workspaceId },
      { $addToSet: { inviteMembers: { $each: emails } } }
    );


    if (result) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json({ error: "Memmbers cannot been added" });
    }
  }

  async editWorkspace(req: Request, res: Response, next: NextFunction) {
    const { workspacename, WorkspaceId } = req.body;


    try {
      const updatedWorkspace = await Workspace.findByIdAndUpdate(
        WorkspaceId,
        { $set: { workspacename: workspacename } },
        { new: true }
      );
      // console.log(updatedWorkspace);

      if (updatedWorkspace) {
        return res.status(200).json(updatedWorkspace);
      } else {
        return res.status(404).json({ error: "Workspace not found" }); // Changed to 404 for not found
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;


      const deleteWorkspace = await Workspace.findByIdAndDelete(workspaceId);

      if (deleteWorkspace) {
        return res.status(200).json(deleteWorkspace);
      } else {
        return res.status(400).json({ error: "Error cannot delete workspace" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getAllInVitedMemberFromWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user) {
      return res.status(401).json({ messsage: "Forbiden" });
    }

    const userId = req.user;
    const findeUserEmail = await this.workspaceusecase.findInvitedUser(
      userId as string
    );


    if (findeUserEmail) {
      const getInvitedMembers = await Workspace.find({
        inviteMembers: { $elemMatch: { userId: userId } },
      });

      if (getInvitedMembers) {
        return res.status(200).json(getInvitedMembers);
      } else {
        return res.status(400).json({ error: "error no invited members " });
      }
    } else {
      return res
        .status(400)
        .json({ error: "No user Exist In the Workpsace for this email " });
    }
  }

  async inviteMemberUsingVerificationLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email, workspaceId } = req.query;
    // console.log("workpsaceId", workspaceId);
    const checkIfUserExist =
      await this.workspaceusecase.chechUserExistOnWorkspace(
        email as string,
        workspaceId as string
      );
    if (checkIfUserExist) {
      // console.log("here");
      return res.status(409).json({ error: "user already exist in worksapce" });
    }

    const userExists = await this.workspaceusecase.userExist(email as string);

    if (userExists) {
      // console.log("userExists");

      const sendMail=await this.workspaceusecase.sendVerificationMailToExistingUser(email as string,workspaceId as string)
      
      return res.status(200).json({ success: "Mail Sended To the user" });
    }

    const mailSend = await this.workspaceusecase.sendVerificationMail(
      email as string,
      workspaceId as string
    );
    if (mailSend) {
      // console.log("mail send");
      
      return res.status(200).json({ success: "Mail Sended To the user" });
    }
  }

  async addDbExistingUserToWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email, workspaceId } = req.query;

    // console.log("req.query",email, workspaceId);

    const addToSpace =
      await this.workspaceusecase.addToSpaceUsecase(
        email as string,
        workspaceId as string
      );

    if (addToSpace) {
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
}
