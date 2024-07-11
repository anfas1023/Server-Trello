"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const commentSchema = new mongoose_1.Schema({
    senderId: { type: String, required: true },
    comment: { type: String, required: true },
});
const assigneSchema = new mongoose_1.Schema({
    email: { type: String, required: false },
    role: { type: String, required: false },
    userId: { type: String, required: false },
    userName: { type: String, required: false }
});
const attachmentSchema = new mongoose_1.Schema({
    attachment: { type: String, required: true },
    originalName: { type: String, required: true },
});
const taskSchema = new mongoose_1.Schema({
    progressionName: { type: String, required: false },
    taskName: { type: String, required: true },
    assignee: { type: [assigneSchema], required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    owner_id: { type: String, required: true },
    attachments: { type: [attachmentSchema], required: false },
    description: { type: String, required: false },
    boardId: { type: String, required: true },
    workspaceId: { type: String, required: true },
    folderId: { type: String, required: true },
    comments: { type: [commentSchema], required: false },
    randomId: { type: String, required: false },
});
// Create and export the model
const Task = mongoose_1.default.model("Task", taskSchema);
exports.default = Task;
