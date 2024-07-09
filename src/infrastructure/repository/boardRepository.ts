import {Board} from '../database/model/boardModel'
import { IBoardRepository } from "../../application/interface/IBoardRepository"

export class BoardRepository implements IBoardRepository {
   async createBoards(boardName:string,workspaceId:string,folderId:string){
    const newBoard=new Board({
        boardName:boardName,
        folderId:folderId,
        workspaceId:workspaceId
    })

    await newBoard.save()

    return newBoard
   }

   async findBoardByFolderId(folderId:string){
    const allBoards=await Board.find();
    return allBoards
   }
}