"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const boardController_1 = require("../controllers/boardController");
const boardUseCase_1 = require("../../application/usecase/boardUseCase");
const boardRepository_1 = require("../../infrastructure/repository/boardRepository");
const verifytoken_1 = __importDefault(require("../../middlewares/verifytoken"));
const boardRepository = new boardRepository_1.BoardRepository();
const boardUsecase = new boardUseCase_1.BoardUsecase(boardRepository);
const boardController = new boardController_1.BoardController(boardUsecase);
router.post('/createBoard', verifytoken_1.default, boardController.createBoard.bind(boardController));
router.get('/getAllBoards', verifytoken_1.default, boardController.getAllBoards.bind(boardController));
exports.default = router;
