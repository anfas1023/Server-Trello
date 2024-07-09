import express  from "express";
import { ChatController } from "../controllers/chatController";
const router=express.Router();

const chatController=new ChatController()

router.get('/conversation/:userId',chatController.conversationGet.bind(chatController))
router.post('/saveConversation',chatController.converstaionSave.bind(chatController));

router.get('/message/:conversationId/:senderId/:reciverId',chatController.getmessage.bind(chatController));
router.post('/saveMessage',chatController.messageSave.bind(chatController));

router.get('/searchUsers/:query/:workspaceId',chatController.searchUser.bind(chatController));

router.post('/addAttachentToChat',chatController.AddAttachementToImage.bind(chatController));


export default router;
