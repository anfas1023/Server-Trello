import { folder as FolderEntity } from "../../domain/entities/folder";

export interface IFolderRepository {
    addFolder(folderName: string, workspaceId: string): Promise<FolderEntity | null>;
    findByWorkspaceId(workspaceId: string): Promise<FolderEntity[] | null>; 
    folderExist(folderName:string) :Promise <string | null>;
    moveToTrash(folderId:string) :Promise<FolderEntity | null>;
    restoreFromTrash(folderId:string):Promise<FolderEntity | null>;
    findByIdAndDeleteFolder(folderId:string):Promise<FolderEntity | null>;
}