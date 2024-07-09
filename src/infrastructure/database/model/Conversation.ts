import mongoose, { Schema, Document } from "mongoose";


interface IConversation extends Document {
    members: string[]; 
    lastMessage:string,
    lastMessagedTime:string,
}


const conversationSchema = new Schema<IConversation>({
    members: {
        type: [String], 
        required: false
    },
    lastMessage:{
        type:String,
        required:false,

    },
    lastMessagedTime:{
        type:String,
        required:false
    }
});



const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;
