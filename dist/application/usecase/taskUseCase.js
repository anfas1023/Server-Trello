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
exports.TaskUseCase = void 0;
class TaskUseCase {
    constructor(TaskRepostiory) {
        this.TaskRepostiory = TaskRepostiory;
    }
    addTaskUseCase(progressionName, taskName, assignee, startDate, endDate, status, priority, owner_id, workspaceId, boardId, folderId, description, randomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.TaskRepostiory.createTask(progressionName, taskName, assignee, endDate, startDate, status, priority, owner_id, workspaceId, boardId, folderId, description, randomId);
            return task;
        });
    }
    getTask(workpspaceId, boardId, folderId, email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.TaskRepostiory.findTaskOfUser(workpspaceId, folderId, boardId, email, userId);
            if (task) {
                return task;
            }
            else {
                return null;
            }
        });
    }
    assignTaskToOthers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const seachResult = yield this.TaskRepostiory;
        });
    }
    attachmentAddUsecase(file, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.TaskRepostiory.addAttachements(file, taskId);
            if (data) {
                return data;
            }
            else {
                return null;
            }
        });
    }
    addDescriptionUsecase(description, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.TaskRepostiory.findTaskAndAddDescription(description, taskId);
            return data;
        });
    }
    addCommentUseCase(taskId, senderId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const addcomment = this.TaskRepostiory.addComment(taskId, senderId, comment);
            return addcomment;
        });
    }
}
exports.TaskUseCase = TaskUseCase;
