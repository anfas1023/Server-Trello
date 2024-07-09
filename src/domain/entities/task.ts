interface assigne {
  email: string;
  role: string;
  userId:string;
  userName:string
}

export interface Task {
    progressionName?: string;
    taskName: string;
    assignee: assigne[];
    startDate: string;
    endDate: string;
    status: string;
    priority: string;
    owner_id: string;
    attachments?: {
      attachment?: string;
      originalName?: string;
    }[];
    description?: string;
    workspaceId: string;
    boardId: string;
    folderId: string;
    comments?: {
      senderId: string;
      comment: string;
    }[];
  }