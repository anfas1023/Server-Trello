import { ITaskRepository } from "../interface/ITaskRepository";
import { ITaskUseCase } from "../interface/ITaskUseCase";

export class TaskUseCase implements ITaskUseCase {
  private TaskRepostiory;
  constructor(TaskRepostiory: ITaskRepository) {
    this.TaskRepostiory = TaskRepostiory;
  }

  async addTaskUseCase(
    progressionName: string,
    taskName: string,
    assignee: string[],
    startDate: string,
    endDate: string,
    status: String,
    priority: string,
    owner_id: string,
    workspaceId:string,boardId:string,folderId:string,description:string,randomId:String
  ) {
    const task = await this.TaskRepostiory.createTask(
      progressionName,
      taskName,
      assignee,
      endDate,
      startDate,
      status,
      priority,
      owner_id,
      workspaceId,
      boardId,
      folderId,
      description,
      randomId
    );
    return task;
  }

  async getTask(workpspaceId:string,boardId:string,folderId:string,email:string,userId:string){
      const task=await this.TaskRepostiory.findTaskOfUser(workpspaceId,folderId,boardId,email,userId);

      if(task){
        return task
      }else{
        return null
      }
  }

  async assignTaskToOthers(query:string){
    const seachResult=await this.TaskRepostiory
  }

  async attachmentAddUsecase(file:any,taskId:string){
    const data=await this.TaskRepostiory.addAttachements(file,taskId)
    if(data){
      return data
    }else{
      return null
    }
  }

  async addDescriptionUsecase(description:string,taskId:string){
  const data=await this.TaskRepostiory.findTaskAndAddDescription(description,taskId)
  return data
  } 


  async addCommentUseCase(taskId:string,senderId:string,comment:string){
const addcomment=this.TaskRepostiory.addComment(taskId,senderId,comment)
return addcomment
  }
}
