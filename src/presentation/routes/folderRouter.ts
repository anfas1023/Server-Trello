import express from "express";
import { FolderRepository } from "../../infrastructure/repository/folderRepository";
import { FolderUsecase } from "../../application/usecase/folderUsecase";
import { FolderController } from "../controllers/folderController";
import verifyToken from "../../middlewares/verifytoken";

const router = express.Router();

const folderrepository = new FolderRepository();
const folderUseCase = new FolderUsecase(folderrepository);
const folderController = new FolderController(folderUseCase);

router.post(
  "/createfolder",
  verifyToken,
  folderController.createFolder.bind(folderController)
);

router.get('/getAllFolders/:workspaceId',verifyToken,folderController.geAllFolders.bind(folderController));

router.put('/editFolder',verifyToken,folderController.editFolder.bind(folderController))

router.post('/moveToTrash/:folderId',verifyToken,folderController.moveToTrash.bind(folderController));

router.put('/restoreTrash/:folderId',verifyToken,folderController.restoreFromTrash.bind(folderController));

router.delete('/deleteFromTrash/:folderId',verifyToken,folderController.deleteFromTrash.bind(folderController));

export default router;
