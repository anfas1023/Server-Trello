"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskRepository_1 = require("../../infrastructure/repository/taskRepository");
const taskUseCase_1 = require("../../application/usecase/taskUseCase");
const taskConroller_1 = require("../controllers/taskConroller");
const socket_1 = require("../../utils/socket");
const router = express_1.default.Router();
const S3Bucket_1 = __importDefault(require("../../utils/S3Bucket"));
const randomIdGenerator_1 = __importDefault(require("../../utils/randomIdGenerator"));
const socketService = new socket_1.SocketService();
const taskRepository = new taskRepository_1.TaskRepository();
const taskUseCase = new taskUseCase_1.TaskUseCase(taskRepository);
const taskController = new taskConroller_1.TaskController(taskUseCase, socketService, randomIdGenerator_1.default);
const verifytoken_1 = __importDefault(require("../../middlewares/verifytoken"));
router.post('/createTask', verifytoken_1.default, taskController.addTask.bind(taskController));
router.get('/getTask/:workspceId/:folderId/:boardId/:email/:userId', taskController.getAllTask.bind(taskController));
// router.get('/assignTaskToOthersFindThem/:query/:workspaceId',taskController.assignTaskToOthersFindThem.bind(taskController))
// router.post('/getAssignedMembers',taskController.findProfileOfAssigne.bind(taskController)) 
router.post('/uploadAttachments/:taskId', verifytoken_1.default, S3Bucket_1.default.single('file'), taskController.UploadAttachemnts.bind(taskController));
router.post('/addDescription/:taskId', verifytoken_1.default, taskController.addDescription.bind(taskController));
router.put('/editTask', verifytoken_1.default, taskController.editTask.bind(taskController));
router.delete('/deleteTask/:taskId', verifytoken_1.default, taskController.deleteTask.bind(taskController));
router.post('/addComment', verifytoken_1.default, taskController.addComment.bind(taskController));
// router.post('/uploadAttachments',)
exports.default = router;
