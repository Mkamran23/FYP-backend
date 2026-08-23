const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const app = require("./app");
const { initializeChatSocket } = require("./sockets/chatSocket");


dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL || "http://localhost:5173" } });

app.set("io", io);
initializeChatSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
