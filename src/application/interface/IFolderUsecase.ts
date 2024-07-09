import { folder } from "../../domain/entities/folder"

export interface IFolderUsecase{
    createFolderusecase(foldername:string,workspaceId:string) :Promise<folder | null>
    FolderExist(folderName:string) :Promise <string | null>;
    moveTrashUseCase(folderId:string) :Promise<folder | null>;
    restoreFromTrash(folderId:string) : Promise<folder | null>;
    deleteFromTrash(folderId:string): Promise<folder | null>; 
}