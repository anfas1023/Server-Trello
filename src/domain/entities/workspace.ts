interface inviteMembers {
    email?:  string, 
    role?: string,
    userId?:string,
    userName?:string
}

interface OwnerDocument  {
    email:string;
    ownerId:string;
    userName:string;
    role:string
  }

export interface workspace{
    _id:string;
    workspacename:string;
    userId:string;
    folderId?:string;
    listId?:string;
    description:string;
    workspaceOwner:OwnerDocument;
    inviteMembers?:inviteMembers[]
}