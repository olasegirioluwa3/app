import express from 'express';
const router = express.Router();
import authenticateToken from '../middlewares/auth.user.middleware.js';
import sendSMS from '../utils/sms.js';
import userController from '../controllers/userController.js';
import userAccessController from '../controllers/userAccessController.js';
import validateUserAccessData from "../middlewares/validator/userAccessValidator.js";

export default function userAccessRoutes (app, io, sequelize) {
  // Registration (handled by userController)
  router.post('/invite', authenticateToken, async (req, res) => {
    try {
      const { data, errors } = await validateUserAccessData( req.body );
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      data.inviteBy = req.user.id;
      await userAccessController.invite(req, res, data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "failed", message: 'Register failed on R', error: error.message });
    }
  });

  // Registration (handled by userController)
  router.post('/get-all', authenticateToken, async (req, res) => {
    try {
      // check if the request is from a verified user
      const data = {};
      data.userId = req.user.id;
      await userAccessController.getAll(req, res, data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "failed", message: 'Register failed on R', error: error.message });
    }
  });

  // Approve
  router.post('/approve', authenticateToken, async (req, res) => {
    try {
      // check if the request is from a verified user
      const { data, errors } = await validateUserAccessData( req.body );
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      // check if the request is from a verified user
      data.userId = req.user.id;
      await userAccessController.approve(req, res, data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "failed", message: 'Register failed on R', error: error.message });
    }
  });

  router.get('/', (req, res) => {
    res.status(200).send({ status: "success", message: 'Whatsapp API called' });
  });

  app.use('/api/useraccess', router);
};