import express from 'express';
import { Application, User } from '../models/index.js';
import initializeApplicationModel from '../models/whatsapp.js';
import initializeUserModel from '../models/user.js';
import { DataTypes } from 'sequelize';

const router = express.Router();

// Function to broadcast Socket.IO messages
const broadcastSocketIoMessage = (io, header, body) => {
  io.emit(header, body);
};

const applicationRoutes = (app, io, sequelize) => {
  const Application = initializeApplicationModel(sequelize, DataTypes);
  const User = initializeUserModel(sequelize, DataTypes);

  // Create a new application
  router.post('/create', async (req, res) => {
    try {
      const userId = req.body.userId;
      const user = await User.findByPk(userId);
      
      if (!user) return res.status(404).send({ status: "failed", message: 'User not found!' });
      
      const application = await Application.create(req.body);
      res.status(201).send({ application, status: "success", message: 'Application created successfully!' });
    } catch (error) {
      res.status(400).send({ status: "failed", message: 'Application creation failed', error });
    }
  });

  // Update payment status after payment
  router.patch('/update-payment/:id', async (req, res) => {
    try {
      const applicationId = req.params.id;
      const application = await Application.findByPk(applicationId);
      
      if (!application) return res.status(404).send({ status: "failed", message: 'Application not found!' });

      application.paymentStatus = req.body.paymentStatus;
      application.paymentReference = req.body.paymentReference;
      await application.save();

      res.send({ application, status: "success", message: 'Payment status updated successfully!' });
    } catch (error) {
      res.status(500).send({ status: "failed", message: 'Failed to update payment status', error });
    }
  });

  // Fetch all applications of a user
  router.get('/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const applications = await Application.findAll({ where: { userId: userId } });
      res.send({ status: "success", applications });
    } catch (error) {
      res.status(500).send({ status: "failed", message: 'Failed to fetch applications', error });
    }
  });

  app.use('/api/applications', router);
};

export default applicationRoutes;
