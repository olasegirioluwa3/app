// Importing necessary modules and packages
import express from 'express';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import axios from 'axios';
import cors from 'cors';
import { createServer } from 'http';
// import socketIO from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
// import applicationRoutes from './routes/applicationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import serviceAccessRoutes from './routes/serviceAccessRoutes.js';
import userAccessRoutes from './routes/userAccessRoutes.js';
// import { sequelize } from './models/index.js';
import db from './models/index.js';
const sequelize = db.sequelize;

// Load environmen
// import socketIO from 'socket.io';
import http from 'http';
// // Import error logging middleware

// // Use error logging middleware
const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: ["https://zionrebornuniversity.com.ng","http://localhost:3001"], 
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/public"));
app.use('/uploads', express.static("public/uploads"));
// app.use('/profileimgs', express.static("public/profileimgs"));

userRoutes(app, null, sequelize);
whatsappRoutes(app, null, sequelize);
// applicationRoutes(app, io, sequelize);
paymentRoutes(app, null, sequelize);
serviceRoutes(app, null, sequelize);
serviceAccessRoutes(app, null, sequelize);
userAccessRoutes(app, null, sequelize);

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

app.get('/', (req, res) => {
  return res.status(201).json({ message: 'Welcome to ZionAI API' });
});
       
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
