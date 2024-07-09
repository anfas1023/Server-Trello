import { board } from "../../domain/entities/Board";

export interface IBoardRepository {
    createBoards(boardName:string,workspaceId:string,folderId:string) : Promise<null | board>;
    findBoardByFolderId(folderId:string) :Promise<null | board[]>
}