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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceUseCase = void 0;
const emailtemplate_1 = __importDefault(require("../../utils/emailtemplate"));
class WorkspaceUseCase {
    constructor(workspaceRepository, mailer) {
        this.workspaceRepository = workspaceRepository;
        this.mailer = mailer;
    }
    createWorkspaceUseCase(workspacename, userId, description, workspaceOwner, username, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspace = yield this.workspaceRepository.registerWorkspace(workspacename, userId, description, workspaceOwner, username, email);
            return workspace;
        });
    }
    workspaceNameExist(workspaceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameExist = yield this.workspaceRepository.workspaceNameExist(workspaceName);
            if (nameExist) {
                return nameExist;
            }
            else {
                return null;
            }
        });
    }
    getAllWorkspaceUsecase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allWorkspace = yield this.workspaceRepository.findWorkspaceByUserId(userId);
            // console.log("allWorkspace",allWorkspace);
            return allWorkspace;
        });
    }
    inviteUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const allUser = yield this.workspaceRepository.findAllUser();
            if (allUser) {
                return allUser;
            }
            else {
                return null;
            }
        });
    }
    sendVerificationMail(email, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const emailToken = crypto.randomBytes(64).toString('hex');
            const verificationLink = `${process.env.FRONTEND_URL}/employee-login?email=${email}&workspaceId=${workspaceId}`;
            const htmlTemplate = (0, emailtemplate_1.default)(verificationLink);
            yield this.mailer.sendEmail(email, htmlTemplate);
            console.log("mail sended to invited user");
            return true;
        });
    }
    sendVerificationMailToExistingUser(email, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifiationLink = `${process.env.BACKEND_URL}/workspace/addTOWorkspace?email=${email}&workspaceId=${workspaceId}`;
            const htmlTemplate = (0, emailtemplate_1.default)(verifiationLink);
            yield this.mailer.sendEmail(email, htmlTemplate);
            console.log("on existing user");
            return true;
        });
    }
    findInvitedUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.workspaceRepository.findInvitedMemberEmail(userId);
        });
    }
    chechUserExistOnWorkspace(email, workpsaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.workspaceRepository.userExistOnWorkspace(email, workpsaceId);
            return user;
        });
    }
    userExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.workspaceRepository.userExist(email);
        });
    }
    addToSpaceUsecase(email, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workpsace = yield this.workspaceRepository.addUserToSpace(email, workspaceId);
            console.log("addTospaceUsecas");
            return workpsace;
        });
    }
}
exports.WorkspaceUseCase = WorkspaceUseCase;
