import { NextFunction, Request, Response } from "express";
import { ITaskUseCase } from "../../application/interface/ITaskUseCase";
import { error } from "console";
import { User } from "../../infrastructure/database/model/authModel";
import { Workspace } from "../../infrastructure/database/model/workspacemodel";
import Task from "../../infrastructure/database/model/taskModel";
import { json } from "stream/consumers";
// import { io } from '../../app'

export class TaskController {
  private TaskUseCase;
  private socketService;
  private generateRandomId;

  constructor(TaskUseCase: ITaskUseCase,socketService : any,generateRandomId:(length:number)=> string) {
    this.TaskUseCase = TaskUseCase;
    this.socketService=socketService;
    this.generateRandomId=generateRandomId
  }

  async addTask(req: Request, res: Response, next: NextFunction) {
    const {
      progressionName,
      taskName,
      assigne,
      endDate,
      startDate,
      status,
      priority,
      ownerId,
      workspaceId,
      boardId,
      folderId,
      description
    } = req.body;
    console.log("request", req.body);

    console.log(description);
    console.log(req.file);
    const randomId=this.generateRandomId(8)
    

    const task = await this.TaskUseCase.addTaskUseCase(
      progressionName,
      taskName,
      assigne,
      endDate,
      startDate,
      status,
      priority,
      ownerId,
      workspaceId,
      boardId,
      folderId,
      description,
      randomId
    );

    console.log(task);
    

    if (task) {
  
      return res.status(200).json(task);
    } else {
      return res.status(400).json({ Error: "Task Should no updated" });
    }
  }

  async getAllTask(req: Request, res: Response, next: NextFunction) {
    const { boardId, workspceId, folderId, email, userId } = req.params;
    // console.log("req.params ",req.params );

    const getTask = await this.TaskUseCase.getTask(
      workspceId,
      boardId,
      folderId,
      email,
      userId
    );
    // console.log("getTask",getTask);

    if (getTask) {
      return res.status(200).json(getTask);
    } else {
      return res.status(400).json({ error: "No Task for the user" });
    }
  }


  

  // async findProfileOfAssigne(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     //   console.log("body", req.body);

  //     const assigneDetails = req.body;
  //     const response = [];

  //     for (const detail of assigneDetails) {
  //       const assignees = detail.assigne;
  //       const taskId = detail.taskId;

  //       const users = await User.find(
  //         { email: { $in: assignees } },
  //         "email profilePhoto"
  //       );

  //       const assigneProfiles = users.map((user) => ({
  //         email: user.email,
  //         profilePhoto: user.profilePhoto,
  //       }));

  //       response.push({
  //         taskId: taskId,
  //         assigneProfiles: assigneProfiles,
  //       });
  //     }

  //     console.log("response", response);

  //     res.status(200).json(response); 
  //   } catch (error) {
  //     console.error("Error finding profile of assignees:", error);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  async assignTaskToOthersFindThem(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { query, workspaceId } = req.params;
    console.log(req.params);

    const work=await Workspace.findById(workspaceId);

    console.log("work",work);
    

    const searchedResult = await Workspace.findOne(
      { _id: workspaceId },
      {
        inviteMembers: {
          $elemMatch: {
            $regex: query,
            $options: "i",
          },
        },
      },
      {new:true}
    );

    console.log("searchedResult12", searchedResult);

    if (searchedResult) {
      return res.status(200).json(searchedResult);
    } else {
      return res.status(200).json({ error: "No User Available" });
    }
  }

  async UploadAttachemnts(req: Request, res: Response, next: NextFunction) {
    console.log("KKJHJK",req.file); 
    const {taskId} =req.params
    console.log(req.file);    
    const data=await this.TaskUseCase.attachmentAddUsecase(req.file,taskId)

    console.log("data",data);
    

    if(data){
      return res.status(201).json(data.attachments[data.attachments.length-1])
    }else{
      return res.status(401).json({error:"Cannot add attachements"});
    }
  }


  async addDescription(req: Request, res: Response, next: NextFunction){
    const {description} =req.body
    const {taskId} =req.params

    const Addeddescription=await this.TaskUseCase.addDescriptionUsecase(description,taskId)

    if(Addeddescription){
      return res.status(201).json(Addeddescription)
    }else{
      return res.status(400).json({error:"error cannot add description"})
    }
  }


  async editTask(req: Request, res: Response, next: NextFunction){
    const {status,startDate,endDate,workspaceId,folderId,boardId,priority,taskName}=req.body

    const editTask=await Task.findOneAndUpdate({workspaceId,boardId,folderId},{
      $set:{
        status:status,
        startDate:startDate,
        endDate:endDate,
        priority:priority,
        taskName:taskName
      }
    })


    // console.log("EditTask",editTask);
    

    if(editTask){
      return res.status(200).json(editTask)
    }else{
      return res.status(401).json({error:"error cannot update the task"})
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction){
    const {workspaceId,folderId,boardId,taskId} = req.params

    const deleteTask=await Task.findByIdAndDelete(taskId);

    console.log("deleteTask",deleteTask);
    
    if(deleteTask){
         return res.status(200).json(deleteTask)
    }else{
      return res.status(402).json({error:"Task cannot been deleted"})
    }
  }


  // async sortTask(req: Request, res: Response){
  //   const {id}=req.params

  //   if(id==="priority"){
  //     const task=await Task.aggregate([

  //     ])
  //   }
  // }


  // async filterTaskByName(req: Request, res: Response){
  //   const {query} =req.params

  //   const taskName
  // }


  async addComment(req: Request, res: Response, next: NextFunction){
    const  {taskId,senderId,comment} = req.body

    const addComment=await this.TaskUseCase.addCommentUseCase(taskId,senderId,comment)

    if(addComment){
      return res.status(201).json(addComment);
    }else{
      return res.status(400).json({error:"cannot add task"})
    }
  }
}
