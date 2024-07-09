import { IFolderUsecase } from "../interface/IFolderUsecase";
import { IFolderRepository } from "../interface/IFolderrepository";



export class FolderUsecase implements IFolderUsecase {
    private FolderRepository;

    constructor(FolderRepository:IFolderRepository){
        this.FolderRepository=FolderRepository
    }

    async createFolderusecase(folderName:string,workspaceId:string){
        const createdFolder=await this.FolderRepository.addFolder(folderName,workspaceId)
        if(createdFolder){
            return createdFolder
        }else{
            return null
        }
     
    }

    async getAllFolders(workspaceId:string){
       const allFolders=await this.FolderRepository.findByWorkspaceId(workspaceId);
       return allFolders
    }

    async FolderExist(foldername:string) {
        const checkFolderExistOrNot=await this.FolderRepository.folderExist(foldername)

        if(checkFolderExistOrNot){
            return "No Folder"
        }else{
            return null
        }
    }


    async moveTrashUseCase(folderId:string){
        const moveToTrash=await this.FolderRepository.moveToTrash(folderId);
        return moveToTrash
    }

    async restoreFromTrash(folderId:string){
        const restoreTrash=await this.FolderRepository.restoreFromTrash(folderId);
        return restoreTrash;
    }

    async deleteFromTrash(folderId:string){
        return await this.FolderRepository.findByIdAndDeleteFolder(folderId)
    }
}