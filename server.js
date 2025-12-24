const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Allow connections from anywhere
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Identify who is who
  socket.on("register-classroom", (roomID) => {
    socket.join(roomID);
    console.log(`Socket ${socket.id} joined room ${roomID}`);
  });

  // Relay Audio Stream
  // We receive binary audio blobs and broadcast them immediately
  socket.on("audio-stream", ({ roomID, audioData }) => {
    socket.to(roomID).emit("play-audio", audioData);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
