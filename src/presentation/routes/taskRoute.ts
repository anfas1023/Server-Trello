import express from 'express';
import { TaskRepository } from '../../infrastructure/repository/taskRepository';
import { TaskUseCase } from '../../application/usecase/taskUseCase';
import { TaskController } from '../controllers/taskConroller';
import { SocketService } from '../../utils/socket'
const router=express.Router()
import uploadMiddleWare from '../../utils/S3Bucket';
import generateRandomId from '../../utils/randomIdGenerator';
const socketService=new SocketService()
const taskRepository=new TaskRepository()
const taskUseCase=new TaskUseCase(taskRepository);
const taskController=new TaskController(taskUseCase,socketService,generateRandomId);
import verifyToken from '../../middlewares/verifytoken';

router.post('/createTask',verifyToken,taskController.addTask.bind(taskController));
router.get('/getTask/:workspceId/:folderId/:boardId/:email/:userId',taskController.getAllTask.bind(taskController))
// router.get('/assignTaskToOthersFindThem/:query/:workspaceId',taskController.assignTaskToOthersFindThem.bind(taskController))
// router.post('/getAssignedMembers',taskController.findProfileOfAssigne.bind(taskController)) 

router.post('/uploadAttachments/:taskId',verifyToken,uploadMiddleWare.single('file'),taskController.UploadAttachemnts.bind(taskController));
router.post('/addDescription/:taskId',verifyToken,taskController.addDescription.bind(taskController));
router.put('/editTask',verifyToken,taskController.editTask.bind(taskController));
router.delete('/deleteTask/:taskId',verifyToken,taskController.deleteTask.bind(taskController));

router.post('/addComment',verifyToken,taskController.addComment.bind(taskController))
// router.post('/uploadAttachments',)
export default router;