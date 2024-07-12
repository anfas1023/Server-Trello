import { IFolderRepository } from '../../application/interface/IFolderrepository';
import { folder as FolderEntity } from '../../domain/entities/folder';
import {Folder} from '../database/model/folderModel';

export class FolderRepository implements IFolderRepository {

    async addFolder(folderName:string,workspaceId:string){
        const newFolder=new Folder({
            folderName:folderName,
         workspaceId:workspaceId,
         trash:false
        })
        await newFolder.save()
        return newFolder 
    }
 
    async findByWorkspaceId(workspaceId: string): Promise<FolderEntity[] | null> {
        const folder = await Folder.find({ workspaceId: workspaceId });
       if(folder){
        return folder;
       }else{
        return null
       }
    }

    async folderExist(folderName:string){
      const folderExist=await Folder.findOne({folderName:folderName})
      
      if(folderExist){
        return null
      }else{
        return "No folder"
      }
    }

    async moveToTrash(folderId:string){
        const moveToTrash=await Folder.findByIdAndUpdate(folderId,{
          trash:true
        });

        return moveToTrash;
    }


    async restoreFromTrash(folderId:string){
      const restore=await Folder.findByIdAndUpdate(folderId,{
        trash:false
      });

      return restore;
    }

    async findByIdAndDeleteFolder(folderId:string){
    const deleteFolder=await Folder.findByIdAndDelete(folderId)
    return deleteFolder
    }

}