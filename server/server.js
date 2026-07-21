import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

import router from './routes/auth.js';
import dashrouter from './routes/dashboard.js';
import db from './db.js';

dotenv.config();

const app = express();
const server = createServer(app);
const onlineUsers = new Map();

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', router);
app.use('/', dashrouter);

io.on('connection', (socket) => {
    socket.on('register', (userId) => {
        onlineUsers.set(String(userId), socket.id);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
        try {
            const [result] = await db.promise().execute(
                `INSERT INTO messages (sender_id, receiver_id, message)
                 VALUES (?, ?, ?)`,
                [senderId, receiverId, message]
            );

            const newMsg = {
                id: result.insertId,
                sender_id: senderId,
                receiver_id: receiverId,
                message: message,
                is_read: 0,
                timestamp: new Date()
            };

            const receiverSocketId = onlineUsers.get(String(receiverId));
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receiveMessage', newMsg);
            }

            socket.emit('receiveMessage', newMsg);
        } catch (err) {
            console.error('sendMessage error:', err);
        }
    });

    socket.on('disconnect', () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});