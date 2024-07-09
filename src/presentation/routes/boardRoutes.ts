import  express  from "express";

const router=express.Router()


import { BoardController } from "../controllers/boardController"
import { BoardUsecase } from "../../application/usecase/boardUseCase"
import { BoardRepository } from "../../infrastructure/repository/boardRepository";
import verifyToken from "../../middlewares/verifytoken"

const boardRepository = new  BoardRepository()
const boardUsecase = new BoardUsecase(boardRepository)
const boardController= new BoardController(boardUsecase);

router.post('/createBoard',verifyToken,boardController.createBoard.bind(boardController));
router.get('/getAllBoards',verifyToken,boardController.getAllBoards.bind(boardController));

export default router;

