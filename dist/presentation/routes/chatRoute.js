"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const router = express_1.default.Router();
const chatController = new chatController_1.ChatController();
router.get('/conversation/:userId', chatController.conversationGet.bind(chatController));
router.post('/saveConversation', chatController.converstaionSave.bind(chatController));
router.get('/message/:conversationId/:senderId/:reciverId', chatController.getmessage.bind(chatController));
router.post('/saveMessage', chatController.messageSave.bind(chatController));
router.get('/searchUsers/:query/:workspaceId', chatController.searchUser.bind(chatController));
router.post('/addAttachentToChat', chatController.AddAttachementToImage.bind(chatController));
exports.default = router;
