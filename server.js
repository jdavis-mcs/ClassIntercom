// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the static HTML files (sender and receiver)
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a specific room (e.g., 'Classroom 101')
    socket.on("join-room", (roomID) => {
        socket.join(roomID);
        console.log(`Socket ${socket.id} joined ${roomID}`);
    });

    // Relay audio from Sender -> Receiver
    socket.on("audio-chunk", ({ roomID, chunk }) => {
        // Broadcast to everyone in the room EXCEPT the sender
        socket.to(roomID).emit("play-chunk", chunk);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
