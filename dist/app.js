"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("./config/database/connection"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_google_outh_1 = __importDefault(require("./utils/passport-google-outh"));
const passport_github_1 = __importDefault(require("./utils/passport-github"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const port = process.env.PORT;
(0, connection_1.default)();
const authRoutes_1 = __importDefault(require("./presentation/routes/authRoutes"));
const workspaceroute_1 = __importDefault(require("./presentation/routes/workspaceroute"));
const folderRouter_1 = __importDefault(require("./presentation/routes/folderRouter"));
const boardRoutes_1 = __importDefault(require("./presentation/routes/boardRoutes"));
const taskRoute_1 = __importDefault(require("./presentation/routes/taskRoute"));
const chatRoute_1 = __importDefault(require("./presentation/routes/chatRoute"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});
exports.io = io;
let users = {};
let chatusers = [];
io.on("connection", (socket) => {
    socket.on("registerUser", (email) => {
        users[email] = socket.id;
        console.log("Registered user:", email);
    });
    socket.on("addUser", (userId) => {
        const isUserExist = chatusers.find((user) => user.userId === userId);
        if (!isUserExist) {
            const user = { userId: userId, socktId: socket.id };
            chatusers.push(user);
            console.log("chatusers", chatusers);
            io.to(socket.id).emit("getUsers", chatusers);
        }
        socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, reciverId, message, conversationId, timestamp }) {
            const reciver = chatusers.find((user) => user.userId === reciverId);
            const sender = chatusers.find((user) => user.userId === senderId);
            // console.log( senderId, reciverId, message, conversationId);
            if (reciver && sender) {
                console.log("here 1");
                console.log("timestamp", timestamp);
                io.to(reciver.socktId).to(sender.socktId).emit("getMessage", {
                    senderId,
                    message,
                    reciverId,
                    conversationId,
                    createdAt: timestamp
                });
            }
            else {
                if (sender) {
                    console.log("here 2");
                    console.log("timestamp", timestamp);
                    io.to(sender.socktId).emit("getMessage", {
                        senderId,
                        message,
                        reciverId,
                        conversationId,
                        createdAt: timestamp
                    });
                }
            }
        }));
    });
    socket.off("sendMessage", (data) => {
        console.log(data);
    });
    socket.on("taskAssigned", ({ task, assignee, workspaceId, folderId, boardId, taskId }) => {
        console.log(workspaceId, folderId, boardId, taskId);
        assignee.forEach((email) => {
            const socketId = users[email];
            console.log("email", email);
            io.emit(`newTaskAssigned_${email === null || email === void 0 ? void 0 : email.email}`, { taskName: task.taskName, email: email, workspaceId, folderId, boardId, taskId });
        });
    });
    socket.off("taskAssigned", (data) => {
        console.log(data);
    });
});
app.use(passport_google_outh_1.default.initialize());
app.use(passport_github_1.default.initialize());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type,Authorization",
}));
const cookieOptions = {
    httpOnly: true,
};
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));
app.use(passport_google_outh_1.default.session());
app.use(passport_github_1.default.session());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/", authRoutes_1.default);
app.use("/workspace", workspaceroute_1.default);
app.use("/folders", folderRouter_1.default);
app.use("/board", boardRoutes_1.default);
app.use("/task", taskRoute_1.default);
app.use("/chat", chatRoute_1.default);
httpServer.listen(port, () => {
    console.log("Server started");
});
