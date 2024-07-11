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
exports.WorkspaceRepository = void 0;
const workspacemodel_1 = require("../database/model/workspacemodel");
const authModel_1 = require("../database/model/authModel");
class WorkspaceRepository {
    registerWorkspace(workspacename, userId, description, workspaceOwner, username, email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("username", username, email, userId, workspaceOwner);
            const newWorkspace = new workspacemodel_1.Workspace({
                workspacename: workspacename,
                userId: userId,
                description: description,
                workspaceOwner: {
                    userName: username,
                    email: email,
                    ownerId: userId,
                    role: "owner"
                },
            });
            yield newWorkspace.save();
            return newWorkspace;
        });
    }
    findWorkspaceByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allWorkspace = yield workspacemodel_1.Workspace.find({ userId: userId });
            return allWorkspace;
        });
    }
    workspaceNameExist(workspaceName) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(workspaceName);
            const workspace = yield workspacemodel_1.Workspace.findOne({ workspacename: workspaceName });
            console.log("workspace", workspace);
            if (workspace &&
                workspace.workspacename.toUpperCase() === workspaceName.toUpperCase()) {
                return workspace;
            }
            return workspace ? workspace : null;
        });
    }
    findAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const allUser = yield authModel_1.User.find();
            if (allUser) {
                return allUser;
            }
            else {
                return null;
            }
        });
    }
    findInvitedMemberEmail(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield authModel_1.User.findById(userId);
            return user;
        });
    }
    userExistOnWorkspace(email, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield workspacemodel_1.Workspace.findOne({
                _id: workspaceId,
                inviteMembers: { $elemMatch: { email: email } }
            });
            return userExists;
        });
    }
    userExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield authModel_1.User.findOne({ email: email });
            return user;
        });
    }
    addUserToSpace(email, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield authModel_1.User.findOne({ email });
                const role = "member";
                console.log("addUserToSpace");
                const result = yield workspacemodel_1.Workspace.findOneAndUpdate({ _id: workspaceId }, { $push: { inviteMembers: { email, role, userId: user === null || user === void 0 ? void 0 : user._id, userName: user === null || user === void 0 ? void 0 : user.username } } }, { new: true });
                console.log("result", result);
                return result;
            }
            catch (error) {
                console.error("Error adding user to space:", error);
                throw error;
            }
        });
    }
}
exports.WorkspaceRepository = WorkspaceRepository;
