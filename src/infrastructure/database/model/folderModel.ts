import mongoose, { Schema, Document } from "mongoose";

interface folderDocument extends Document {
  _id:string;
  folderName: string;
  listId: string;
  workspaceId: string;
  trash: boolean;
}

const folderSchema = new Schema<folderDocument>({
  folderName: { type: String, required: true },
  listId: { type: String, required: false },
  workspaceId: { type: String, required: true },
  trash: { type: Boolean, required: false },
});

export const Folder = mongoose.model<folderDocument>("Folder", folderSchema);
