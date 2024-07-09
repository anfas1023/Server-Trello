import mongoose, { Schema, Document } from "mongoose";
interface AttachmentDocument extends Document {
    attachment: string;
    originalName: string;
  }

interface IMessage extends Document {
    conversationId: string;
    senderId: string;
    message: string;
    receiverId: string;
    createdAt: Date;
    attachments:AttachmentDocument[]
   
}
const attachmentSchema = new Schema<AttachmentDocument>({
    attachment: { type: String, required: true },
    originalName: { type: String, required: true },
  });

const messageSchema = new Schema<IMessage>({
    conversationId: {
        type: String,
        required: false
    },
    senderId: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    receiverId: {
        type: String,
        required: false
    },
    createdAt:{
        type:Date,
        required:false
    },
    attachments: { type: [attachmentSchema], required: false },

});

export const Message = mongoose.model<IMessage>("Message", messageSchema);
