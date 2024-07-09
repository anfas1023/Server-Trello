import mongoose, { Schema, Document } from "mongoose";

// Define the interface for a comment document
interface CommentDocument extends Document {
  senderId: string;
  comment: string;
}

const commentSchema = new Schema<CommentDocument>({
  senderId: { type: String, required: true },
  comment: { type: String, required: true },
});

// Define the interface for an attachment document
interface AttachmentDocument extends Document {
  attachment: string;
  originalName: string;
}

interface assigne extends Document {
  email: string;
  role: string;
  userId:string;
  userName:string
}

const assigneSchema=new Schema<assigne>(
  {
    email: { type: String, required: false },
    role: { type: String, required: false },
    userId:{type:String,required:false},
    userName:{type:String,required:false}
  }
)

const attachmentSchema = new Schema<AttachmentDocument>({
  attachment: { type: String, required: true },
  originalName: { type: String, required: true },
});

// Define the interface for a task document
interface TaskDocument extends Document {
  progressionName: string;
  taskName: string;
  assignee: assigne[];
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  owner_id: string;
  attachments: AttachmentDocument[];
  description: string;
  workspaceId: string;
  boardId: string;
  folderId: string;
  comments: CommentDocument[];
  randomId:string;
}

const taskSchema = new Schema<TaskDocument>({
  progressionName: { type: String, required: false },
  taskName: { type: String, required: true },
  assignee: { type: [assigneSchema], required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  owner_id: { type: String, required: true },
  attachments: { type: [attachmentSchema], required: false },
  description: { type: String, required: false },
  boardId: { type: String, required: true },
  workspaceId: { type: String, required: true },
  folderId: { type: String, required: true },
  comments: { type: [commentSchema], required: false },
  randomId:{type:String,required:false} ,
});

// Create and export the model
const Task = mongoose.model<TaskDocument>("Task", taskSchema);

export default Task;