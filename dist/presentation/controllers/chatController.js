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
exports.ChatController = void 0;
const Conversation_1 = __importDefault(require("../../infrastructure/database/model/Conversation"));
const Message_1 = require("../../infrastructure/database/model/Message");
const authModel_1 = require("../../infrastructure/database/model/authModel");
const workspacemodel_1 = require("../../infrastructure/database/model/workspacemodel");
class ChatController {
    converstaionSave(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId, receiverId } = req.body;
                const newConversation = new Conversation_1.default({
                    memebers: [senderId, receiverId],
                });
            }
            catch (error) {
                console.log("error", error);
            }
        });
    }
    conversationGet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const conversation = yield Conversation_1.default.find({
                    members: { $in: [userId] },
                });
                const conversationData = Promise.all(conversation.map((conversation) => __awaiter(this, void 0, void 0, function* () {
                    const receiverId = conversation.members.find((member) => member !== userId);
                    const user = yield authModel_1.User.findById(receiverId);
                    return {
                        user: {
                            id: user === null || user === void 0 ? void 0 : user._id,
                            email: user === null || user === void 0 ? void 0 : user.email,
                            username: user === null || user === void 0 ? void 0 : user.username,
                            profilePhoto: user === null || user === void 0 ? void 0 : user.profilePhoto
                        },
                        conversationId: conversation._id,
                        lastmessage: conversation.lastMessage,
                        lastMessagedTime: conversation.lastMessagedTime,
                    };
                })));
                // console.log("conversationData", await conversationData);
                return res.status(200).json(yield conversationData);
                // const user=await User.findById(receiverId)
            }
            catch (error) { }
        });
    }
    messageSave(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { conversationId, senderId, message, reciverId, timestamp } = req.body;
                console.log(req.body);
                // console.log(timestamp);
                // console.log("req.body",req.body);reciverId:
                if (!senderId || !message || !reciverId) {
                    // console.log("on 1");
                    return res.status(400).json("Please fill all required fields");
                }
                if (conversationId === 'new' && reciverId) {
                    const newCoversation = new Conversation_1.default({
                        members: [senderId, reciverId],
                        lastMessage: message,
                        lastMessagedTime: timestamp
                    });
                    yield newCoversation.save();
                    const newMessage = new Message_1.Message({
                        conversationId: newCoversation._id,
                        senderId,
                        message,
                        receiverId: reciverId,
                        createdAt: timestamp
                    });
                    yield newMessage.save();
                    const reciverDetails = yield authModel_1.User.findById(reciverId);
                    // console.log("on 2");
                    // console.log(newMessage);
                    return res.status(200).json({ messsage: "Message sent successfully", conversationId: newCoversation._id, senderId: senderId, reciverId: reciverId, reciverDetails, createdAt: timestamp });
                }
                else if (!conversationId && !reciverId) {
                    // console.log("on 3");
                    return res.status(400).json("Please fill all required fields");
                }
                const newMessage = new Message_1.Message({ conversationId, senderId, message, receiverId: reciverId, createdAt: timestamp });
                yield newMessage.save();
                const conversationUpdate = yield Conversation_1.default.findByIdAndUpdate(conversationId, {
                    $set: {
                        lastMessage: message,
                        lastMessagedTime: timestamp
                    }
                });
                // console.log("on 4");
                // console.log(newMessage);
                const reciverDetails = yield authModel_1.User.findById(reciverId);
                res.status(200).json({ message: "Message sent successfully", conversationId: conversationId, senderId: senderId, reciverId: reciverId, reciverDetails, createdAt: timestamp });
            }
            catch (error) {
                console.log(error, "Error");
            }
        });
    }
    getmessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkMessage = (conversationId, senderId, reciverId) => __awaiter(this, void 0, void 0, function* () {
                    const message = yield Message_1.Message.find({ conversationId });
                    const messageUserData = Promise.all(message.map((message) => __awaiter(this, void 0, void 0, function* () {
                        const user = yield authModel_1.User.findById(message.senderId);
                        return {
                            message: message,
                        };
                    })));
                    const reciverDetails = yield authModel_1.User.findById(reciverId);
                    // console.log("messageUserData",await messageUserData);
                    res.status(200).json({ message: yield messageUserData, conversationId: conversationId, senderId: senderId, reciverId: reciverId, reciverDetails: reciverDetails });
                });
                const conversationId = req.params.conversationId;
                const senderId = req.params.senderId;
                const reciverId = req.params.reciverId;
                // console.log("req.params",req.params);
                if (conversationId === "new") {
                    const checkConversation = yield Conversation_1.default.find({
                        members: { $all: [req.query.senderId, req.query.receiverId] },
                    });
                    console.log("1");
                    if (checkConversation.length > 0) {
                        checkMessage(checkConversation[0]._id, senderId, reciverId);
                        console.log("2");
                    }
                    else {
                        const reciverDetails = yield authModel_1.User.findById(reciverId);
                        const allData = {
                            reciverDetails,
                            reciverId,
                            senderId,
                            message: []
                        };
                        return res.status(200).json(allData);
                    }
                }
                else {
                    // console.log("here");
                    checkMessage(conversationId, senderId, reciverId);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    searchUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, workspaceId } = req.params;
                console.log(req.params);
                const searchedResult = yield workspacemodel_1.Workspace.findOne({ _id: workspaceId }, {
                    inviteMembers: {
                        $elemMatch: {
                            email: { $regex: query, $options: "i" }
                        }
                    }
                });
                console.log("searchedResult", searchedResult);
                const emails = searchedResult === null || searchedResult === void 0 ? void 0 : searchedResult.inviteMembers.map((memebers) => {
                    return memebers.email;
                });
                // console.log("emails",emails);
                const userData = yield authModel_1.User.find({
                    email: { $in: emails },
                });
                // console.log("userData", userData);
                return res.status(200).json(userData);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    AddAttachementToImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, reciverId, conversationId, message, timestamp } = req.body;
            console.log(req.file);
            const newMessage = new Message_1.Message({
                conversationId, senderId, message, reciverId: reciverId, createdAt: timestamp
            });
            yield newMessage.save();
            return res.status(201).json(newMessage);
        });
    }
}
exports.ChatController = ChatController;
