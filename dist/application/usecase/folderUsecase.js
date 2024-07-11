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
exports.FolderUsecase = void 0;
class FolderUsecase {
    constructor(FolderRepository) {
        this.FolderRepository = FolderRepository;
    }
    createFolderusecase(folderName, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdFolder = yield this.FolderRepository.addFolder(folderName, workspaceId);
            if (createdFolder) {
                return createdFolder;
            }
            else {
                return null;
            }
        });
    }
    getAllFolders(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allFolders = yield this.FolderRepository.findByWorkspaceId(workspaceId);
            return allFolders;
        });
    }
    FolderExist(foldername) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkFolderExistOrNot = yield this.FolderRepository.folderExist(foldername);
            if (checkFolderExistOrNot) {
                return "No Folder";
            }
            else {
                return null;
            }
        });
    }
    moveTrashUseCase(folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const moveToTrash = yield this.FolderRepository.moveToTrash(folderId);
            return moveToTrash;
        });
    }
    restoreFromTrash(folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const restoreTrash = yield this.FolderRepository.restoreFromTrash(folderId);
            return restoreTrash;
        });
    }
    deleteFromTrash(folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.FolderRepository.findByIdAndDeleteFolder(folderId);
        });
    }
}
exports.FolderUsecase = FolderUsecase;
