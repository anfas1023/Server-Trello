import express from 'express'
const router=express.Router()
import { WorkspaceController } from '../controllers/workspaceController'
import { WorkspaceUseCase } from '../../application/usecase/workspaceUseCase'
import { WorkspaceRepository } from '../../infrastructure/repository/workspaceRepository'
import {Mailer} from '../../utils/mailer';

import verifyToken from '../../middlewares/verifytoken'

const mailer= new Mailer()

const repository=new WorkspaceRepository();
const workspaceUseCase=new WorkspaceUseCase(repository,mailer)
const workspaceController=new WorkspaceController(workspaceUseCase)

router.post('/createWorkspace',verifyToken,workspaceController.createWorkspace.bind(workspaceController))
router.get('/getAllWorkspace',verifyToken,workspaceController.getAllWorkspcae.bind(workspaceController))
router.get('/allUser',workspaceController.inviteUser.bind(workspaceController));

// router.get('/inviteToWorkspace/:query',workspaceController.searchUserToAddWorkspace.bind(workspaceController))

// router.post('/addMemberToWorkspace',workspaceController.addMemenersToWorkspace.bind(workspaceController));

router.put('/editWorkpsace',verifyToken,workspaceController.editWorkspace.bind(workspaceController))

router.delete('/deleteWorkspace/:workspaceId',verifyToken,workspaceController.deleteWorkspace.bind(workspaceController))

router.get('/getAllWorkspaceByInvitedMembers',verifyToken,workspaceController.getAllInVitedMemberFromWorkspace.bind(workspaceController)) ;

router.get('/sendInvitationLink',verifyToken,workspaceController.inviteMemberUsingVerificationLink.bind(workspaceController));

// router.post('/uploadAttachments',uploadMiddleWare.single('file'),workspaceController.UploadAttachemnts.bind(workspaceController)); 
router.get('/addTOWorkspace',workspaceController.addDbExistingUserToWorkspace.bind(workspaceController))

export default router




