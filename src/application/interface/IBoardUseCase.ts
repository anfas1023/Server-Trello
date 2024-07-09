import { board } from "../../domain/entities/Board";

export interface IBoardUsecase {
    createBoard(boardName:string,workspaceId:string,folderId:string) :Promise<null | board>;
    getAllBoardUsecase(folderId:string) :Promise<null | board[] >

}