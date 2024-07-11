"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const workspaceController_1 = require("../controllers/workspaceController");
const workspaceUseCase_1 = require("../../application/usecase/workspaceUseCase");
const workspaceRepository_1 = require("../../infrastructure/repository/workspaceRepository");
const mailer_1 = require("../../utils/mailer");
const verifytoken_1 = __importDefault(require("../../middlewares/verifytoken"));
const mailer = new mailer_1.Mailer();
const repository = new workspaceRepository_1.WorkspaceRepository();
const workspaceUseCase = new workspaceUseCase_1.WorkspaceUseCase(repository, mailer);
const workspaceController = new workspaceController_1.WorkspaceController(workspaceUseCase);
router.post('/createWorkspace', verifytoken_1.default, workspaceController.createWorkspace.bind(workspaceController));
router.get('/getAllWorkspace', verifytoken_1.default, workspaceController.getAllWorkspcae.bind(workspaceController));
router.get('/allUser', workspaceController.inviteUser.bind(workspaceController));
// router.get('/inviteToWorkspace/:query',workspaceController.searchUserToAddWorkspace.bind(workspaceController))
// router.post('/addMemberToWorkspace',workspaceController.addMemenersToWorkspace.bind(workspaceController));
router.put('/editWorkpsace', verifytoken_1.default, workspaceController.editWorkspace.bind(workspaceController));
router.delete('/deleteWorkspace/:workspaceId', verifytoken_1.default, workspaceController.deleteWorkspace.bind(workspaceController));
router.get('/getAllWorkspaceByInvitedMembers', verifytoken_1.default, workspaceController.getAllInVitedMemberFromWorkspace.bind(workspaceController));
router.get('/sendInvitationLink', verifytoken_1.default, workspaceController.inviteMemberUsingVerificationLink.bind(workspaceController));
// router.post('/uploadAttachments',uploadMiddleWare.single('file'),workspaceController.UploadAttachemnts.bind(workspaceController)); 
router.get('/addTOWorkspace', workspaceController.addDbExistingUserToWorkspace.bind(workspaceController));
exports.default = router;
