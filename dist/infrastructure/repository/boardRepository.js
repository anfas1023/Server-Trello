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
exports.BoardRepository = void 0;
const boardModel_1 = require("../database/model/boardModel");
class BoardRepository {
    createBoards(boardName, workspaceId, folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBoard = new boardModel_1.Board({
                boardName: boardName,
                folderId: folderId,
                workspaceId: workspaceId
            });
            yield newBoard.save();
            return newBoard;
        });
    }
    findBoardByFolderId(folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allBoards = yield boardModel_1.Board.find();
            return allBoards;
        });
    }
}
exports.BoardRepository = BoardRepository;
