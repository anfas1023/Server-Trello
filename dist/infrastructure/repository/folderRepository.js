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
exports.FolderRepository = void 0;
const folderModel_1 = require("../database/model/folderModel");
class FolderRepository {
    addFolder(folderName, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFolder = new folderModel_1.Folder({
                folderName: folderName,
                workspaceId: workspaceId,
                trash: false
            });
            yield newFolder.save();
            return newFolder;
        });
    }
    findByWorkspaceId(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = yield folderModel_1.Folder.find({ workspaceId: workspaceId });
            if (folder) {
                return folder;
            }
            else {
                return null;
            }
        });
    }
    folderExist(folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderExist = yield folderModel_1.Folder.findOne({ folderName: folderName });
            if (folderExist) {
                return null;
            }
            else {
                return "No folder";
            }
        });
    }
    moveToTrash(folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const moveToTrash = yield folderModel_1.Folder.findByIdAndUpdate(folderId, {
                trash: true
            });
            return moveToTrash;
        });
    }
    restoreFromTrash(folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const restore = yield folderModel_1.Folder.findByIdAndUpdate(folderId, {
                trash: false
            });
            return restore;
        });
    }
    findByIdAndDeleteFolder(folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteFolder = yield folderModel_1.Folder.findByIdAndDelete(folderId);
            return deleteFolder;
        });
    }
}
exports.FolderRepository = FolderRepository;
