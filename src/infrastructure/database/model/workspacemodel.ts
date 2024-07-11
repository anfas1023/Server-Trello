import mongoose, { Schema, Document } from "mongoose";
interface Member {
  email: string;
  role: string;
  userId:string;
  userName:string
}

interface OwnerDocument extends Document {
  email:string;
  ownerId:string;
  userName:string;
  role:string
}

interface workspaceDocument extends Document {
  _id:string;
  workspacename: string;
  userId: string;
  folderId: string;
  listId: string;
  description:string;
  workspaceOwner:OwnerDocument;
  inviteMembers:Member[];
}

const memberSchema = new Schema<Member>({
  email: { type: String, required: false },
  role: { type: String, required: false },
  userId:{type:String,required:false},
  userName:{type:String,required:false}
});




const ownerSchema = new Schema<OwnerDocument>({
  email: { type: String, required: false },
  role: { type: String, required: false },
  ownerId:{type:String,required:false},
  userName:{type:String,required:false}
});



const workspaceSchema = new Schema<workspaceDocument>({
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
  description:{
    type:String,
    required:false
  },
  workspaceOwner:{
    type:ownerSchema,
    required:false
  },
  inviteMembers: { type: [memberSchema], required: false }
});

export const Workspace = mongoose.model<workspaceDocument>(
  "Workspace",
  workspaceSchema
);
