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
exports.Workspace = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const memberSchema = new mongoose_1.Schema({
    email: { type: String, required: false },
    role: { type: String, required: false },
    userId: { type: String, required: false },
    userName: { type: String, required: false }
});
const ownerSchema = new mongoose_1.Schema({
    email: { type: String, required: false },
    role: { type: String, required: false },
    ownerId: { type: String, required: false },
    userName: { type: String, required: false }
});
const workspaceSchema = new mongoose_1.Schema({
    workspacename: { type: String, required: true },
    userId: { type: String, required: true },
    folderId: {
        type: String,
        required: false,
    },
    listId: {
        type: String,
        require: false,
    },
    description: {
        type: String,
        required: false
    },
    workspaceOwner: {
        type: ownerSchema,
        required: false
    },
    inviteMembers: { type: [memberSchema], required: false }
});
exports.Workspace = mongoose_1.default.model("Workspace", workspaceSchema);
