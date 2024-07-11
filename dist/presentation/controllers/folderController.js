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
exports.FolderController = void 0;
const folderModel_1 = require("../../infrastructure/database/model/folderModel");
class FolderController {
    constructor(FolderUsecase) {
        this.FolderUsecase = FolderUsecase;
    }
    createFolder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { folderName, workspaceId } = req.body;
            // console.log(req.body);
            const folderExist = yield this.FolderUsecase.FolderExist(folderName);
            if (folderExist) {
                const createFolder = yield this.FolderUsecase.createFolderusecase(folderName, workspaceId);
                // console.log(createFolder);
                if (createFolder) {
                    return res.status(200).json(createFolder);
                }
                else {
                    return res.status(404).json({ error: "Error Creating an folder" });
                }
            }
            else {
                return res.status(409).json({ error: "Folder Exist" });
            }
        });
    }
    geAllFolders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { workspaceId } = req.params;
            //  console.log(req.params);
            const allFolders = yield this.FolderUsecase.getAllFolders(workspaceId);
            if (allFolders) {
                return res.status(200).json(allFolders);
            }
            else {
                return res.status(400).json({ error: "No Folders finded" });
            }
        });
    }
    editFolder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { folderId, folderName } = req.body;
            // console.log(req.body);
            const editFolder = yield folderModel_1.Folder.findByIdAndUpdate(folderId, {
                $set: {
                    folderName: folderName,
                },
            });
            if (editFolder) {
                return res.status(200).json(editFolder);
            }
            else {
                return res.status(400).json({ error: "Folder cannot been edited" });
            }
        });
    }
    moveToTrash(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { folderId } = req.params;
            // console.log(req.params);
            // const deleteFolder=await Folder.findByIdAndDelete(folderId)
            const moveToTrash = yield this.FolderUsecase.moveTrashUseCase(folderId);
            if (moveToTrash) {
                return res.status(200).json(moveToTrash);
            }
            else {
                return res.status(400).json({ error: "Folder cannot Move to trash" });
            }
        });
    }
    restoreFromTrash(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { folderId } = req.params;
            console.log(req.params);
            const restoreTrash = yield this.FolderUsecase.restoreFromTrash(folderId);
            if (restoreTrash) {
                return res.status(200).json(restoreTrash);
            }
            else {
                return res.status(400).json({ error: "Cannot move to trash" });
            }
        });
    }
    deleteFromTrash(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { folderId } = req.params;
            console.log(req.params);
            const deleteFromTrash = yield this.FolderUsecase.deleteFromTrash(folderId);
            if (deleteFromTrash) {
                return res.status(200).json(deleteFromTrash);
            }
            else {
                return res.status(400).json({ error: "Cannot delete" });
            }
        });
    }
}
exports.FolderController = FolderController;
