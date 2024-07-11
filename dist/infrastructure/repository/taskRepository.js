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
exports.TaskRepository = void 0;
const taskModel_1 = __importDefault(require("../database/model/taskModel"));
class TaskRepository {
    createTask(progressionName, taskName, assignee, startDate, endDate, status, priority, owner_id, workspaceId, boardId, folderId, description, randomId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("here", owner_id, assignee);
            const taskData = {
                taskName,
                assignee: assignee,
                startDate,
                endDate,
                status,
                priority,
                owner_id,
                workspaceId,
                boardId,
                folderId,
                description,
                randomId
            };
            const newTask = new taskModel_1.default(taskData);
            yield newTask.save();
            return newTask;
        });
    }
    findTaskOfUser(workspaceId, folderId, boardId, email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("workspaceId", workspaceId, folderId, boardId, email);
            const assignedTasks = yield taskModel_1.default.find({
                workspaceId: workspaceId,
                folderId: folderId,
                boardId: boardId,
                assignee: { $elemMatch: { email: email } },
            });
            console.log("assignedTasks", assignedTasks);
            // return assignedTask
            if (assignedTasks.length !== 0) {
                // console.log("assignedTask",assignedTask);
                return assignedTasks;
            }
            const OwnerTask = yield taskModel_1.default.find({
                workspaceId: workspaceId,
                folderId: folderId,
                boardId: boardId,
                owner_id: userId,
            });
            // console.log("1");
            if (OwnerTask) {
                console.log("OwnerTask", OwnerTask);
                return OwnerTask;
            }
            else {
                return null;
            }
        });
    }
    // async findUserAndAssignTask(query:string){
    //   const searchedResult = await Workspace.find({
    //     inviteMembers: {
    //       $elemMatch: {
    //         $regex: query,
    //         $options: "i",
    //       },
    //     },
    //   });
    //   return searchedResult
    // }
    addAttachements(file, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("file", file.originalname, file.location);
            const data = { attachment: file.location, originalName: file.originalname };
            const updatedTask = yield taskModel_1.default.findByIdAndUpdate(taskId, { $push: { attachments: data } }, { new: true });
            return updatedTask;
        });
    }
    findTaskAndAddDescription(description, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const addDescription = yield taskModel_1.default.findByIdAndUpdate(taskId, {
                $set: {
                    description: description
                }
            }, { new: true });
            return addDescription;
        });
    }
    addComment(taskId, senderId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = { senderId, comment };
            const adddedComent = yield taskModel_1.default.findByIdAndUpdate(taskId, { $push: { comments: newComment } }, { new: true, useFindAndModify: false });
            return adddedComent;
        });
    }
}
exports.TaskRepository = TaskRepository;
