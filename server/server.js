import express from  'express';
import { createServer } from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import router from './routes/auth.js';
import dashrouter from './routes/dashboard.js';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import db from './db.js';

import path from 'path';


dotenv.config();

const app = express();
const onlineUsers = new Map(); // ✅ add this line

const server = createServer(app);

const io = new Server (server, {
    cors: {origin : "http://localhost:5173", credentials:true}
});


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));


app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',router);
app.use('/',dashrouter);


io.on('connection', (socket) => {
  // console.log('🔌 new connection:', socket.id);

  // ✅ ADD THIS — was completely missing
  socket.on('register', (userId) => {
    onlineUsers.set(String(userId), socket.id);
    // console.log('🟢 registered:', userId, '→', socket.id);
    // console.log('📋 onlineUsers:', Array.from(onlineUsers.entries()));
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    try {
      const [result] = await db.promise().execute(
        `INSERT INTO messages (sender_id, receiver_id, message)
         VALUES (?, ?, ?)`,
        [senderId, receiverId, message]
      );

      const newMsg = {
        id:          result.insertId,
        sender_id:   senderId,
        receiver_id: receiverId,
        message:     message,
        is_read:     0,
        timestamp:   new Date()
      };

      // console.log('📨 newMsg:', newMsg);
      // console.log('📋 onlineUsers:', Array.from(onlineUsers.entries()));

      const receiverSocketId = onlineUsers.get(String(receiverId));
      // console.log('📡 receiverSocketId:', receiverSocketId);

      if (receiverSocketId) {
        // console.log('✅ sending to receiver');
        io.to(receiverSocketId).emit('receiveMessage', newMsg);
      } else {
        // console.log('❌ receiver not online');
      }

      socket.emit('receiveMessage', newMsg);

    } catch (err) {
      // console.error('sendMessage error:', err);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        // console.log('🔴 disconnected:', userId);
        break;
      }
    }
    // console.log('📋 onlineUsers after disconnect:', Array.from(onlineUsers.entries()));
  });

});

server.listen(5000,()=>{
    // console.log('server running on port 5000');
})

// app.listen(5000,()=>{
//     console.log('server running on port 5000');
// })
