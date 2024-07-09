import { NextFunction, Request, Response } from "express";
import { FolderUsecase } from "../../application/usecase/folderUsecase";
import { Folder } from "../../infrastructure/database/model/folderModel";
import { error } from "console";

export class FolderController {
  private FolderUsecase;
  constructor(FolderUsecase: FolderUsecase) {
    this.FolderUsecase = FolderUsecase;
  }

  async createFolder(req: Request, res: Response, next: NextFunction) {
    const { folderName, workspaceId } = req.body;

    // console.log(req.body);

    const folderExist=await this.FolderUsecase.FolderExist(folderName)

    if(folderExist){


      const createFolder = await this.FolderUsecase.createFolderusecase(
        folderName,
        workspaceId
      );
  
      // console.log(createFolder);
  
      if (createFolder) {
        return res.status(200).json(createFolder);
      } else {
        return res.status(404).json({ error: "Error Creating an folder" });
      }
    }else{
      return res.status(409).json({error:"Folder Exist"})
    }


  }

  async geAllFolders(req: Request, res: Response, next: NextFunction) {
    const { workspaceId } = req.params;
    //  console.log(req.params);

    const allFolders = await this.FolderUsecase.getAllFolders(workspaceId);

    if (allFolders) {
      return res.status(200).json(allFolders);
    } else {
      return res.status(400).json({ error: "No Folders finded" });
    }
  }

  async editFolder(req: Request, res: Response, next: NextFunction) {
    const { folderId, folderName } = req.body;
    // console.log(req.body);

    const editFolder = await Folder.findByIdAndUpdate(folderId, {
      $set: {
        folderName: folderName,
      },
    });
    if (editFolder) {
      return res.status(200).json(editFolder);
    } else {
      return res.status(400).json({ error: "Folder cannot been edited" });
    }
  }

  async moveToTrash(req: Request, res: Response, next: NextFunction){
    const {folderId} = req.params

    // console.log(req.params);
    

    // const deleteFolder=await Folder.findByIdAndDelete(folderId)
    const moveToTrash=await this.FolderUsecase.moveTrashUseCase(folderId)

    if(moveToTrash){
      return res.status(200).json(moveToTrash)
    }else{
      return res.status(400).json({error:"Folder cannot Move to trash"});
    }

  }

  async restoreFromTrash(req: Request, res: Response, next: NextFunction){

    const {folderId} = req.params

    console.log(req.params)
      
    const restoreTrash=await this.FolderUsecase.restoreFromTrash(folderId);

    if(restoreTrash){
      return res.status(200).json(restoreTrash)
    }else{
      return res.status(400).json({error:"Cannot move to trash"});
    }

  }


  async deleteFromTrash(req: Request, res: Response, next: NextFunction){
    const {folderId} = req.params

    console.log(req.params);
    

    const deleteFromTrash=await this.FolderUsecase.deleteFromTrash(folderId)

    if(deleteFromTrash){
      return res.status(200).json(deleteFromTrash)
    }else{
      return res.status(400).json({error:"Cannot delete"})

    }
  }


}
