
import { io } from "../app";

export class SocketService {
  // private data;
  // constructor(data:any){
      // this.data=data
  // }

  async handleSendNotification(assigne: any,task : any) {
    io.emit("taskAssigned", { assignee: assigne, task });
  }
}
