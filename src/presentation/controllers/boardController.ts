import { NextFunction, Request, Response } from "express";
import { IBoardUsecase } from "../../application/interface/IBoardUseCase";


export class BoardController {
    private BoardUsecase;
    constructor(BoardUsecase:IBoardUsecase){
        this.BoardUsecase=BoardUsecase
    }
    async createBoard(req: Request, res: Response, next: NextFunction){
        const {folderId,workspaceId,boardName}=req.body

        // console.log(req.body);
        

        const createBoard=await this.BoardUsecase.createBoard(boardName,folderId,workspaceId)

        if(createBoard){
            return res.status(201).json(createBoard)
        }else{
          return res.status(400).json({error:"Error occured in creation of board"})
        }
    }

    async getAllBoards(req: Request, res: Response, next: NextFunction){
        const {folderId}=req.body

        const allBoards=await this.BoardUsecase.getAllBoardUsecase(folderId);

        if(allBoards){
            return res.status(200).json(allBoards)
        }else{
            return res.status(400).json({Error:"Cannot get Boards Something Went Wrong"})
        }

    }
}