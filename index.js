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
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
// import applicationRoutes from './routes/applicationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import serviceAccessRoutes from './routes/serviceAccessRoutes.js';
import userAccessRoutes from './routes/userAccessRoutes.js';
import { sequelize } from './models/index.js';

// Load environment variables
// const express = require('express');
// import express from "express";
// require('dotenv').config();
// const { sequelize } = require('./models/index');
// const socketIO = require('socket.io');
// const http = require('http');
// // Import error logging middleware

// // Use error logging middleware
// const app = express();
// const server = http.createServer(app);
// const cors = require('cors');
// const io = socketIO(server, {
//   cors: {
//     origin: ["https://zionrebornuniversity.com.ng","http://localhost:3001"], 
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("/public"));
// app.use('/uploads', express.static("public/uploads"));
// // app.use('/profileimgs', express.static("public/profileimgs"));

// // Import and use the userRoutes function passing app and io
// const userRoutes = require('./routes/userRoutes');
// const whatsappRoutes = require('./routes/whatsappRoutes');
// const applicationRoutes = require('./routes/applicationRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');
// const serviceAccessRoutes = require('./routes/serviceAccessRoutes');
// const userAccessRoutes = require('./routes/userAccessRoutes');

// userRoutes(app, io, sequelize);
// whatsappRoutes(app, io, sequelize);
// applicationRoutes(app, io, sequelize);
// paymentRoutes(app, io, sequelize);
// serviceRoutes(app, io, sequelize);
// serviceAccessRoutes(app, io, sequelize);
// userAccessRoutes(app, io, sequelize);

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// const PORT = process.env.PORT || 8000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
