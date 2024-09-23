import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./config/database/connection";
import Session from "express-session";
import cookieParser from "cookie-parser";    
import passport from "./utils/passport-google-outh";
import passport1 from "./utils/passport-github";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();     
const port = process.env.PORT;
connectDatabase();
import authRouter from "./presentation/routes/authRoutes";
import workspaceroute from "./presentation/routes/workspaceroute";
import folderRouter from "./presentation/routes/folderRouter";
import boardRoutes from "./presentation/routes/boardRoutes";
import taskRoutes from "./presentation/routes/taskRoute";
import chatRoutes from "./presentation/routes/chatRoute";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:process.env.FRONTEND_URL ,
    credentials: true,
  },
});

type chatusersType = {
  user: { userId: string; socktId: string };
};

let users: {
  [email: string]: string;
} = {};

let chatusers: { userId: string; socktId: string }[] = [];

io.on("connection", (socket) => {
  socket.on("registerUser", (email) => {
    users[email] = socket.id;
    console.log("Registered user:", email);
  });

  socket.on("addUser", (userId: string) => {
    const userIndex = chatusers.findIndex((user) => user.userId === userId);
    const socketChecking = chatusers.find((user) => user.socktId === socket.id);
  
    if (!socketChecking) {
      if (userIndex !== -1) {
        chatusers.splice(userIndex, 1); 
      }
  
      const user = { userId: userId, socktId: socket.id };
      chatusers.push(user);
      console.log("chatusers", chatusers);
  
      io.to(socket.id).emit("getUsers", chatusers);
    }
  
    socket.on(
      "sendMessage",
      async ({ senderId, reciverId, message, conversationId,timestamp }) => {
        const reciver = chatusers.find((user) => user.userId === reciverId);
        const sender = chatusers.find((user) => user.userId === senderId);
        console.log( senderId, reciverId, message, conversationId);
        
        if (reciver && sender) {
          console.log("here 1");
          console.log("timestamp",timestamp);  
          
          
          io.to(reciver.socktId).to(sender.socktId).emit("getMessage", {
            senderId,
            message,
            reciverId,
            conversationId,
           createdAt:timestamp
          });
        } else {
          if (sender) {
          console.log("here 2");
          console.log("timestamp",timestamp);  

            io.to(sender.socktId).emit("getMessage", {
              senderId,
              message,
              reciverId,
              conversationId,
              createdAt:timestamp
            });
          }
        }
      }
    );
  });


  socket.off("sendMessage",(data)=>{
     console.log(data);
     
  });

  socket.on("taskAssigned", ({ task, assignee,workspaceId,folderId,boardId,taskId }) => {
    console.log(workspaceId,folderId,boardId,taskId);
    assignee.forEach((email: any) => {
      const socketId = users[email];
      console.log("email",email);
      
      io.emit(`newTaskAssigned_${email?.email}`, { taskName: task.taskName, email: email,workspaceId,folderId,boardId,taskId });

    });
  });

  socket.off("taskAssigned",(data)=>{
    console.log(data);
 });


});

export { io };
app.use(passport.initialize());
app.use(passport1.initialize());
console.log("process.env.FRONTEND_URL",process.env.FRONTEND_URL)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,  
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type,Authorization",
  })
);
const cookieOptions = {
  httpOnly: true,
};

app.use(cookieParser());
app.use(
  Session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.session());
app.use(passport1.session());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRouter);
app.use("/workspace", workspaceroute);
app.use("/folders", folderRouter);
app.use("/board", boardRoutes);
app.use("/task", taskRoutes);
app.use("/chat", chatRoutes);

httpServer.listen(port, () => {
  console.log("Server started");
});
