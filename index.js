import express from 'express';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import axios from 'axios';
import cors from 'cors';
import { createServer } from 'http';
import userRoutes from './routes/userRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import serviceAccessRoutes from './routes/serviceAccessRoutes.js';
import userAccessRoutes from './routes/userAccessRoutes.js';
import db from './models/index.js';
const sequelize = db.sequelize;

import http from 'http';
// Import error logging middleware

// Use error logging middleware
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/public"));
app.use('/uploads', express.static("public/uploads"));
// app.use('/profileimgs', express.static("public/profileimgs"));

userRoutes(app, null, sequelize);
whatsappRoutes(app, null, sequelize);
paymentRoutes(app, null, sequelize);
serviceRoutes(app, null, sequelize);
serviceAccessRoutes(app, null, sequelize);
userAccessRoutes(app, null, sequelize);

app.get('/', (req, res) => {
  return res.status(201).json({ message: 'Welcome to ZionAI API' });
});
       
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});