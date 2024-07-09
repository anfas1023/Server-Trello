interface inviteMembers {
    email?:  string, 
    role?: string,
    userId?:string,
    userName?:string
}

export interface workspace{
    _id:string;
    workspacename:string;
    userId:string;
    folderId?:string;
    listId?:string;
    description:string;
    inviteMembers?:inviteMembers[]
}