import express from 'express';
const router = express.Router();
import authenticateToken from '../middlewares/auth.user.middleware.js';
import phoneNumber from 'phone-number';
import validateServiceData from '../middlewares/validator/serviceValidator.js';
import serviceController from '../controllers/serviceController.js';

export default function serviceRoutes (app, io, sequelize) {
  
  router.post('/', async (req, res) => { 
    try {
      let input = {};
      input = req.body;
      const { data, errors } = await validateServiceData(input);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const services = await serviceController.getAll(req, res, data);
    } catch (error) {
      res.status(500).send({ status: "failed", message: 'Failed to fetch services', error });
    }
  });

  router.post('/create', async (req, res) => { 
    try {
      let input = {};
      input = req.body;
      const { data, errors } = await validateServiceData(input);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const services = await serviceController.createService(req, res, data);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", message: 'Failed to fetch services', error });
    }
  });

  router.post('/:svGroupCode/group/view', async (req, res) => { 
    try {
      const input = req.params;
      const { data, errors } = await validateServiceData(input);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const svGroupCode = data.svGroupCode;
      const services = await serviceController.getAllInGroupCode(req, res, data);
      // res.send({ status: "success", services });
    } catch (error) {
      res.status(500).send({ status: "failed", message: 'Failed to fetch services', error });
    }
  });

  router.post('/:svId/view', async (req, res) => { 
    try {
      const input = req.params;
      const { data, errors } = await validateServiceData(input);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const service = await serviceController.getOne(req, res, data);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", message: 'Failed to fetch services in r', error });
    }
  });
  
  app.use('/api/services', router);
}