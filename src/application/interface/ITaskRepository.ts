import { Task } from "../../domain/entities/task";

export interface ITaskRepository {
    createTask(progressionName:string,taskName:string,assignee:string[],startDate:string,endDate:string,status:String,priority:string,owner_id:string,workpspaceId:string,boardId:string,folderId:string,description:string,randomId:String) : Promise<Task | null>;
    findTaskOfUser(workspaceId:string,folderId:string,boardId:string,email:string,userId:string) : Promise<Task[] | null>; 
    // findUserAndAssignTask(query:string) :Promise<String[] | null> 
    addAttachements(file:any,taskId:string) :Promise<any>
    findTaskAndAddDescription(description:string,taskId:string) :Promise<Task | null>;
    addComment(taskId: string, senderId: string, comment: string) :Promise<Task | null>
}