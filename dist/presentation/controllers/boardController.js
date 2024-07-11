"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
class BoardController {
    constructor(BoardUsecase) {
        this.BoardUsecase = BoardUsecase;
    }
    createBoard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { folderId, workspaceId, boardName } = req.body;
            // console.log(req.body);
            const createBoard = yield this.BoardUsecase.createBoard(boardName, folderId, workspaceId);
            if (createBoard) {
                return res.status(201).json(createBoard);
            }
            else {
                return res.status(400).json({ error: "Error occured in creation of board" });
            }
        });
    }
    getAllBoards(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { folderId } = req.body;
            const allBoards = yield this.BoardUsecase.getAllBoardUsecase(folderId);
            if (allBoards) {
                return res.status(200).json(allBoards);
            }
            else {
                return res.status(400).json({ Error: "Cannot get Boards Something Went Wrong" });
            }
        });
    }
}
exports.BoardController = BoardController;
