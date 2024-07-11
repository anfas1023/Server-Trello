"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceController = void 0;
const authModel_1 = require("../../infrastructure/database/model/authModel");
// import { error } from "console";
const workspacemodel_1 = require("../../infrastructure/database/model/workspacemodel");
class WorkspaceController {
    constructor(workspaceusecase) {
        this.workspaceusecase = workspaceusecase;
    }
    createWorkspace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { workspacename, userId, description, workspaceOwner, username, email } = req.body;
                // console.log(req.body);
                const sameNameExist = yield this.workspaceusecase.workspaceNameExist(workspacename);
                if (sameNameExist) {
                    return res.status(400).json({ error: "Workspace Name exist" });
                }
                else {
                    const workspace = yield this.workspaceusecase.createWorkspaceUseCase(workspacename, userId, description, workspaceOwner, username, email);
                    // console.log("workspace",workspace);
                    if (workspace) {
                        return res.status(201).json(workspace);
                    }
                    else {
                        return res
                            .status(400)
                            .json({ error: "Workspcae Cannot bben created" });
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllWorkspcae(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                console.log("getAllWorkspcae");
                const userId = req.user;
                // console.log(req.user)
                // const  userId="lfnvkejf"
                const getAllWorkspace = yield this.workspaceusecase.getAllWorkspaceUsecase(userId);
                // console.log("getAllWorkspace", getAllWorkspace);
                if (getAllWorkspace) {
                    return res.status(200).json(getAllWorkspace);
                }
                else {
                    return res
                        .status(400)
                        .json({ error: "No Workspcae Found By that User" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    inviteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield this.workspaceusecase.inviteUser();
            if (allUsers) {
                return res.status(200).json(allUsers);
            }
            else {
                return res.status(400).json({ Error: "No User avilable" });
            }
        });
    }
    searchUserToAddWorkspace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.params;
            const searchedResult = yield authModel_1.User.find({
                email: { $regex: query, $options: "i" },
            });
            // console.log("searchedResult",searchedResult);
            if (searchedResult) {
                return res.status(200).json(searchedResult);
            }
            else {
                return res.status(200).json({ error: "No User Available" });
            }
        });
    }
    addMemenersToWorkspace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { workspaceId, emails } = req.body;
            const result = yield workspacemodel_1.Workspace.updateOne({ _id: workspaceId }, { $addToSet: { inviteMembers: { $each: emails } } });
            // console.log("result",result);
            if (result) {
                return res.status(201).json(result);
            }
            else {
                return res.status(400).json({ error: "Memmbers cannot been added" });
            }
        });
    }
    editWorkspace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { workspacename, WorkspaceId } = req.body;
            console.log("body", req.body);
            try {
                const updatedWorkspace = yield workspacemodel_1.Workspace.findByIdAndUpdate(WorkspaceId, { $set: { workspacename: workspacename } }, { new: true });
                // console.log(updatedWorkspace);
                if (updatedWorkspace) {
                    return res.status(200).json(updatedWorkspace);
                }
                else {
                    return res.status(404).json({ error: "Workspace not found" }); // Changed to 404 for not found
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    deleteWorkspace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { workspaceId } = req.params;
                // console.log("req.params",req.params);
                const deleteWorkspace = yield workspacemodel_1.Workspace.findByIdAndDelete(workspaceId);
                if (deleteWorkspace) {
                    return res.status(200).json(deleteWorkspace);
                }
                else {
                    return res.status(400).json({ error: "Error cannot delete workspace" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllInVitedMemberFromWorkspace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("getAllInVitedMemberFromWorkspace");
            // console.log("req.user", req.user);
            //  const {userId}=req.params
            if (!req.user) {
                return res.status(401).json({ messsage: "Forbiden" });
            }
            const userId = req.user;
            const findeUserEmail = yield this.workspaceusecase.findInvitedUser(userId);
            // console.log("errpr");
            if (findeUserEmail) {
                const getInvitedMembers = yield workspacemodel_1.Workspace.find({
                    inviteMembers: { $elemMatch: { userId: userId } },
                });
                // console.log("getInvitedMembers", getInvitedMembers);
                if (getInvitedMembers) {
                    // console.log("here");
                    return res.status(200).json(getInvitedMembers);
                }
                else {
                    return res.status(400).json({ error: "error no invited members " });
                }
            }
            else {
                return res
                    .status(400)
                    .json({ error: "No user Exist In the Workpsace for this email " });
            }
        });
    }
    inviteMemberUsingVerificationLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, workspaceId } = req.query;
            // console.log("workpsaceId", workspaceId);
            const checkIfUserExist = yield this.workspaceusecase.chechUserExistOnWorkspace(email, workspaceId);
            if (checkIfUserExist) {
                // console.log("here");
                return res.status(409).json({ error: "user already exist in worksapce" });
            }
            const userExists = yield this.workspaceusecase.userExist(email);
            if (userExists) {
                // console.log("userExists");
                const sendMail = yield this.workspaceusecase.sendVerificationMailToExistingUser(email, workspaceId);
                return res.status(200).json({ success: "Mail Sended To the user" });
            }
            const mailSend = yield this.workspaceusecase.sendVerificationMail(email, workspaceId);
            if (mailSend) {
                // console.log("mail send");
                return res.status(200).json({ success: "Mail Sended To the user" });
            }
        });
    }
    addDbExistingUserToWorkspace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, workspaceId } = req.query;
            console.log("req.query", email, workspaceId);
            const addToSpace = yield this.workspaceusecase.addToSpaceUsecase(email, workspaceId);
            if (addToSpace) {
                return res.redirect(`${process.env.FRONTEND_URL}/login`);
            }
        });
    }
}
exports.WorkspaceController = WorkspaceController;
