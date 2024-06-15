import express from 'express';
const router = express.Router();
import authenticateToken from '../middlewares/auth.user.middleware.js';
import phoneNumber from 'phone-number';
import validateServiceAccessData from "../middlewares/validator/serviceAccessValidator.js";
import serviceAccessController from '../controllers/serviceAccessController.js';

export default function serviceAccessRoutes (app, io, sequelize) {
  
  router.post('/', authenticateToken, async (req, res) => { 
    try {
      let data = {};
      const serviceaccess = await serviceAccessController.getAll(req, res, data);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", message: 'Failed to fetch services', error });
    }
  });

  router.post('/activate', authenticateToken, async (req, res) => { 
    try {
      const { data, errors } = await validateServiceAccessData(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      console.log(data);
      const serviceaccess = await serviceAccessController.activateServiceAccess(req, res, data);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", message: 'Failed to create service access on R', error });
    }
  });
  
  router.post('/:id', authenticateToken, async (req, res) => { 
    try {
      let data = {};
      data.id = req.params.id;
      const serviceaccess = await serviceAccessController.getOne(req, res, data);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", message: 'Failed to fetch services', error });
    }
  });

  app.use('/api/serviceaccess', router);
}