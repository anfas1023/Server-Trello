import { Task } from "../../domain/entities/task";

export  interface ITaskUseCase {
    addTaskUseCase(progressionName:string,taskName:string,assignee:string[],startDate:string,endDate:string,status:String,priority:string,owner_id:string,workpspaceId:string,boardId:string,folderId:string,description:string,randomId:String) :Promise<Task | null>;
    getTask(workpspaceId:string,boardId:string,folderId:string,email:string,userId:string) : Promise<Task[] | null>;
    attachmentAddUsecase(file:any,taskId:string) : Promise< any>
    addDescriptionUsecase(description:string,taskId:String) :Promise<Task | null>
    addCommentUseCase(taskId:string,senderId:string,comment:string) :Promise<Task | null>
}