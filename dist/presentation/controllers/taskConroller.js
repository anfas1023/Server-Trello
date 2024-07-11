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
exports.TaskController = void 0;
const workspacemodel_1 = require("../../infrastructure/database/model/workspacemodel");
const taskModel_1 = __importDefault(require("../../infrastructure/database/model/taskModel"));
// import { io } from '../../app'
class TaskController {
    constructor(TaskUseCase, socketService, generateRandomId) {
        this.TaskUseCase = TaskUseCase;
        this.socketService = socketService;
        this.generateRandomId = generateRandomId;
    }
    addTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { progressionName, taskName, assigne, endDate, startDate, status, priority, ownerId, workspaceId, boardId, folderId, description } = req.body;
            console.log("request", req.body);
            console.log(description);
            console.log(req.file);
            const randomId = this.generateRandomId(8);
            const task = yield this.TaskUseCase.addTaskUseCase(progressionName, taskName, assigne, endDate, startDate, status, priority, ownerId, workspaceId, boardId, folderId, description, randomId);
            console.log(task);
            if (task) {
                return res.status(200).json(task);
            }
            else {
                return res.status(400).json({ Error: "Task Should no updated" });
            }
        });
    }
    getAllTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { boardId, workspceId, folderId, email, userId } = req.params;
            // console.log("req.params ",req.params );
            const getTask = yield this.TaskUseCase.getTask(workspceId, boardId, folderId, email, userId);
            // console.log("getTask",getTask);
            if (getTask) {
                return res.status(200).json(getTask);
            }
            else {
                return res.status(400).json({ error: "No Task for the user" });
            }
        });
    }
    // async findProfileOfAssigne(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     //   console.log("body", req.body);
    //     const assigneDetails = req.body;
    //     const response = [];
    //     for (const detail of assigneDetails) {
    //       const assignees = detail.assigne;
    //       const taskId = detail.taskId;
    //       const users = await User.find(
    //         { email: { $in: assignees } },
    //         "email profilePhoto"
    //       );
    //       const assigneProfiles = users.map((user) => ({
    //         email: user.email,
    //         profilePhoto: user.profilePhoto,
    //       }));
    //       response.push({
    //         taskId: taskId,
    //         assigneProfiles: assigneProfiles,
    //       });
    //     }
    //     console.log("response", response);
    //     res.status(200).json(response); 
    //   } catch (error) {
    //     console.error("Error finding profile of assignees:", error);
    //     res.status(500).json({ message: "Internal server error" });
    //   }
    // }
    assignTaskToOthersFindThem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, workspaceId } = req.params;
            console.log(req.params);
            const work = yield workspacemodel_1.Workspace.findById(workspaceId);
            console.log("work", work);
            const searchedResult = yield workspacemodel_1.Workspace.findOne({ _id: workspaceId }, {
                inviteMembers: {
                    $elemMatch: {
                        $regex: query,
                        $options: "i",
                    },
                },
            }, { new: true });
            console.log("searchedResult12", searchedResult);
            if (searchedResult) {
                return res.status(200).json(searchedResult);
            }
            else {
                return res.status(200).json({ error: "No User Available" });
            }
        });
    }
    UploadAttachemnts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("KKJHJK", req.file);
            const { taskId } = req.params;
            console.log(req.file);
            const data = yield this.TaskUseCase.attachmentAddUsecase(req.file, taskId);
            console.log("data", data);
            if (data) {
                return res.status(201).json(data.attachments[data.attachments.length - 1]);
            }
            else {
                return res.status(401).json({ error: "Cannot add attachements" });
            }
        });
    }
    addDescription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { description } = req.body;
            const { taskId } = req.params;
            const Addeddescription = yield this.TaskUseCase.addDescriptionUsecase(description, taskId);
            if (Addeddescription) {
                return res.status(201).json(Addeddescription);
            }
            else {
                return res.status(400).json({ error: "error cannot add description" });
            }
        });
    }
    editTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, startDate, endDate, workspaceId, folderId, boardId, priority, taskName } = req.body;
            const editTask = yield taskModel_1.default.findOneAndUpdate({ workspaceId, boardId, folderId }, {
                $set: {
                    status: status,
                    startDate: startDate,
                    endDate: endDate,
                    priority: priority,
                    taskName: taskName
                }
            });
            // console.log("EditTask",editTask);
            if (editTask) {
                return res.status(200).json(editTask);
            }
            else {
                return res.status(401).json({ error: "error cannot update the task" });
            }
        });
    }
    deleteTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { workspaceId, folderId, boardId, taskId } = req.params;
            const deleteTask = yield taskModel_1.default.findByIdAndDelete(taskId);
            console.log("deleteTask", deleteTask);
            if (deleteTask) {
                return res.status(200).json(deleteTask);
            }
            else {
                return res.status(402).json({ error: "Task cannot been deleted" });
            }
        });
    }
    // async sortTask(req: Request, res: Response){
    //   const {id}=req.params
    //   if(id==="priority"){
    //     const task=await Task.aggregate([
    //     ])
    //   }
    // }
    // async filterTaskByName(req: Request, res: Response){
    //   const {query} =req.params
    //   const taskName
    // }
    addComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { taskId, senderId, comment } = req.body;
            const addComment = yield this.TaskUseCase.addCommentUseCase(taskId, senderId, comment);
            if (addComment) {
                return res.status(201).json(addComment);
            }
            else {
                return res.status(400).json({ error: "cannot add task" });
            }
        });
    }
}
exports.TaskController = TaskController;
