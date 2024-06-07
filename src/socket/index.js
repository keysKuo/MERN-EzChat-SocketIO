const express = require('express');
const app = express();
const configs = require("../configs");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: configs["frontendURL"],
		methods: ["GET", "POST"],
	},
});

const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
	console.log("✔️ New Client connected!", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;
    
	// io.emit() is used to send event to all connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen events. can be used both on client and server
	socket.on("disconnect", () => {
		console.log("❌ Client disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}

module.exports = { app, server, io, getReceiverSocketId };
