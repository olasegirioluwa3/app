import express from 'express';
import authenticateToken from '../middlewares/auth.user.middleware.js';
import validatePaymentData from '../middlewares/validator/paymentValidator.js';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

export default function setupPaymentRoutes(app, io, sequelize) {
  router.post('/create', authenticateToken, async (req, res) => {
    try {
      const { data, errors } = await validatePaymentData(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      await paymentController.create(req, res, data);
    } catch (error) {
      console.log(error);
      res.status(400).send({ status: "failed", message: 'Failed to record payment', error });
    }
  });

  router.post('/:paymentReference', async (req, res) => {
    try {
      const { paymentReference } = req.params;
      let data = { paymentReference };
      await paymentController.getOne(req, res, data);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", message: 'Failed to update payment status', error });
    }
  });

  router.post('/payment-status/:paymentReference', async (req, res) => {
    try {
      const { paymentReference } = req.params;
      let data = { paymentReference };
      await paymentController.verify(req, res, data);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", message: 'Failed to update payment status', error });
    }
  });

  app.use('/api/payment', router);
}
