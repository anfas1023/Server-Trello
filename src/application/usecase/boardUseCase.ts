import { IBoardRepository } from "../interface/IBoardRepository";
import { IBoardUsecase } from "../interface/IBoardUseCase";

export class BoardUsecase implements IBoardUsecase {
  private BoardRepository;

  constructor(BoardRepository: IBoardRepository) {
    this.BoardRepository = BoardRepository;
  }

  async createBoard(boardName: string, folderId: string, workspaceId: string) {
    const createdBoard = this.BoardRepository.createBoards(
      boardName,
      workspaceId,
      folderId
    );
    return createdBoard;
  }

  async getAllBoardUsecase(folderId: string) {
    const Boards = await this.BoardRepository.findBoardByFolderId(folderId);

    if (Boards) {
      return Boards;
    } else {
      return null;
    }
  }
}
