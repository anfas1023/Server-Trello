import { NextFunction, Request, Response } from "express";
import Conversation from "../../infrastructure/database/model/Conversation";
import { Message } from "../../infrastructure/database/model/Message";
import { User } from "../../infrastructure/database/model/authModel";
import { Workspace } from "../../infrastructure/database/model/workspacemodel";
export class ChatController {
  async converstaionSave(req: Request, res: Response, next: NextFunction) {
    try {
      const { senderId, receiverId } = req.body;
      const newConversation = new Conversation({
        memebers: [senderId, receiverId],
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  async conversationGet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const conversation = await Conversation.find({
        members: { $in: [userId] },
      });
      const conversationData = Promise.all(
        conversation.map(async (conversation) => {
          const receiverId = conversation.members.find(
            (member) => member !== userId
          );
          const user = await User.findById(receiverId);
          return {
            user: {
              id: user?._id,
              email: user?.email,
              username: user?.username,
              profilePhoto:user?.profilePhoto
            },
            conversationId: conversation._id,
            lastmessage:conversation.lastMessage,
            lastMessagedTime:conversation.lastMessagedTime,
          };
        })
      );

      // console.log("conversationData", await conversationData);

      return res.status(200).json(await conversationData);

      // const user=await User.findById(receiverId)
    } catch (error) {}
  }

  async messageSave(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId, senderId, message, reciverId,timestamp } = req.body;

      // console.log(req.body);

      
      if (!senderId || !message || !reciverId){
        // console.log("on 1");
        return res.status(400).json("Please fill all required fields");
      }
       

      if (conversationId==='new' && reciverId ) {
        const newCoversation = new Conversation({
          members: [senderId, reciverId],
          lastMessage:message,
          lastMessagedTime:timestamp
        });
        await newCoversation.save();
        const newMessage = new Message({
          conversationId: newCoversation._id,
          senderId,
          message,
          receiverId:reciverId,
          createdAt:timestamp
        });
        await newMessage.save();
        const reciverDetails=await User.findById(reciverId)
        
        return res.status(200).json({messsage:"Message sent successfully",conversationId:newCoversation._id,senderId:senderId,reciverId:reciverId,reciverDetails,createdAt:timestamp});
      } else if (!conversationId && !reciverId) {
        // console.log("on 3");

        return res.status(400).json("Please fill all required fields");
      }
      const newMessage = new Message({ conversationId, senderId, message,receiverId:reciverId,createdAt:timestamp });
      await newMessage.save();
      const conversationUpdate=await Conversation.findByIdAndUpdate(conversationId,{
        $set:{
          lastMessage:message,
          lastMessagedTime:timestamp
        }
      })
      // console.log("on 4");
      // console.log(newMessage);
      
      const reciverDetails=await User.findById(reciverId)


      res.status(200).json({message:"Message sent successfully",conversationId:conversationId,senderId:senderId,reciverId:reciverId,reciverDetails,createdAt:timestamp});
    } catch (error) {
      console.log(error, "Error");
    }
  }

  async getmessage(req: Request, res: Response, next: NextFunction) {
try {
    const checkMessage = async (conversationId: string,senderId:string,reciverId:string) => {
        const message = await Message.find({ conversationId });
  
        const messageUserData = Promise.all(
          message.map(async (message) => {
            const user = await User.findById(message.senderId);
  
            return {
              message: message,
            };
          })
        );

        const reciverDetails=await User.findById(reciverId);

        // console.log("messageUserData",await messageUserData);
        
  
        res.status(200).json({message:await messageUserData,conversationId:conversationId,senderId:senderId,reciverId:reciverId,reciverDetails:reciverDetails});
      };
  
      const conversationId = req.params.conversationId;
      const senderId=req.params.senderId;
      const reciverId=req.params.reciverId;

      // console.log("req.params",req.params);
      
  
      if (conversationId === "new") {
        const checkConversation = await Conversation.find({
          members: { $all: [req.query.senderId, req.query.receiverId] },
        });

        // console.log("1");
        

  
        if (checkConversation.length > 0) {
          checkMessage(checkConversation[0]._id as string,senderId,reciverId);  
        // console.log("2");   

        } else {
          const reciverDetails=await User.findById(reciverId);
          const allData={
            reciverDetails,
            reciverId,
            senderId,
            message:[]
          }
          return res.status(200).json(allData);
        }
      } else {
        // console.log("here");
        
        checkMessage(conversationId,senderId,reciverId);
      }
} catch (error) {
    console.log(error);
}
  }

  async searchUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, workspaceId } = req.params;
    console.log(req.params);

    const searchedResult = await Workspace.findOne(
      { _id: workspaceId },
      {
        inviteMembers: {
          $elemMatch: {
            email: { $regex: query, $options: "i" }
          }
        }
      }
    );

    // console.log("searchedResult",searchedResult);
    
    
    

    const emails = searchedResult?.inviteMembers.map((memebers) => {
      return memebers.email;
    });

    // console.log("emails",emails);
    

    const userData = await User.find({
      email: { $in: emails },
    });

    // console.log("userData", userData);

    return res.status(200).json(userData);
    } catch (error) {
      console.log(error);
      
    }
  }


  async AddAttachementToImage(req: Request, res: Response, next: NextFunction){
    const {senderId,reciverId,conversationId,message,timestamp} = req.body
    console.log("chat attachements",req.file);

    const newMessage = new Message({
       conversationId, senderId, message,reciverId:reciverId,createdAt:timestamp 
      });

      await newMessage.save()

      return res.status(201).json(newMessage)
    
  }
}
