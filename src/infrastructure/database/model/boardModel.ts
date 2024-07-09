import mongoose, { Schema, Document } from "mongoose";

interface boardDocument extends Document {
  boardName: string;
  folderId: string;
  workspaceId: string;
  trash: boolean;
  taskId: string;
}

const boardSchema = new Schema<boardDocument>({
    boardName:{type:String,required:true},
    folderId:{type:String,required:true},
    workspaceId:{type:String,required:true},
    trash:{type:Boolean,required:false},
    taskId:{type:String,required:false}
});


export const Board=mongoose.model<boardDocument>("Board",boardSchema)
