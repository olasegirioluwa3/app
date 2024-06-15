import bcrypt from "bcryptjs";
import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const sequelize = db.sequelize;
const User = sequelize.models.user;
const UserAccess = sequelize.models.useraccess;
const ServiceAccess = sequelize.models.serviceaccess;
import sendEmail from "../utils/email";
import generateToken from "../utils/encrypt";
const domain = process.env.APP_WEBSITE_URL || "localhost:3000";

async function getAll(req, res, data) {
  try {
    const useraccess = await UserAccess.findAll({where:{userId: req.user.id}});
    if (!useraccess){
      return res.status(401).json({ message: 'No User Access was found, try again' });
    }
    return res.status(200).json({ status: "success", useraccess });
  } catch (error) {
    console.error(error.message);
    if (error instanceof Sequelize.UniqueConstraintError) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      console.log(error);
      res.status(500).json({ message: "Registration failed on C" });
    }
  }
}

async function invite(req, res, data) {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).send({ status: "failed", error: 'Unknown user' });
    }

    const serviceaccess = await ServiceAccess.findByPk(data.saId);
    if (!serviceaccess) {
      return res.status(400).send({ status: "failed", error: 'Unknown service access' });
    }

    const useraccess = await UserAccess.findOne({where: {userId: user.id, saId: data.saId, role: "Admin"}})
    if (!useraccess) {
      return res.status(400).send({ status: "failed", error: 'You are not privilegde to invite user' });
    }

    if (!await User.emailExist(data.email)){
      // create an account for the email
      data.password = "&AreYouDoingWell1.";
      const token = generateToken();
      
      const verifyLink = `${domain}/account/email-verify/${token}`;
      const emailText = `To verify your account email, click on the following link: ${verifyLink}, default password: ${data.password}`;
      
      data.emailVerificationToken = token;
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
      
      const newUser = new User(data);
      if (await newUser.save(data)) {
        await sendEmail(data.email, "Invitation and Activate your account", emailText);
        data.userId = newUser.id;
        const newUserAccess = new UserAccess(data);
        console.log(data);
        if (await newUserAccess.save(data)) {
          return res.status(201).json({ message: "Registration successful" });
        }
      } else {
        return res.status(401).json({ message: "Registration failed, try again" });
      }
    } else {
      console.log("email already exist, check useraccess");
      const newUser = await User.findOne({where: {email: data.email}});
      if (!newUser) {
        return res.status(400).send({ status: "failed", error: 'You are not privilegde to invite user' });
      }
      const useraccess = await UserAccess.findOne({where: {userId: newUser.id}});
      if (useraccess) {
        return res.status(400).send({ status: "failed", error: 'User Access already have granted' });
      }
      const newAccess = {};
      newAccess.userId = newUser.id;
      newAccess.saId = serviceaccess.id;
      newAccess.inviteBy = user.id;
      newAccess.role = data.role;

      const newUserAccess = new UserAccess(newAccess);
      if (await newUserAccess.save(newAccess)) {
        const verifyLink = `${domain}/auth/login`;
        const emailText = `To accept invite, login by clicking on the following link: ${verifyLink}`;
        await sendEmail(data.email, "Invitation request", emailText);
        return res.status(201).json({ message: "Registration successful" });
      }
    }
    // check if user have admin access to service
    res.status(401).json({ message: "Registration failed after, try again" });
  } catch (error) {
    console.error(error.message);
    if (error instanceof Sequelize.UniqueConstraintError) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      console.log(error);
      res.status(500).json({ message: "Registration failed on C" });
    }
  }
}

async function getAll(req, res, data) {
  try {
    const useraccess = await UserAccess.findAll({where:{userId:data.userId}});
    if (!useraccess){
      return res.status(401).json({ message: 'No User Access was found, try again' });
    } else {
      res.status(201).json({ status: "success", message: "Registration successful", useraccess });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Get UserAccess failed on C" });
  }
}

async function approve(req, res, data) {
  try {
    // Check if user has access
    const userAccess = await UserAccess.findOne({ where: { saId: data.saId, userId: req.user.id } });
    if (!userAccess) {
      return res.status(401).json({ message: 'No User Access was found, please try again' });
    }

    // Update user access status
    userAccess.status = 'Active';
    userAccess.acceptDate = new Date();
    const savedUserAccess = await userAccess.save();

    if (savedUserAccess) {
      return res.status(201).json({ message: 'UserAccess Activated successfully', status: 'success' });
    } else {
      return res.status(401).json({ message: 'UserAccess Activation failed, please try again' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'UserAccess Approve failed on C' });
  }
}


module.exports = {
    getAll,
    invite,
    approve
};
// const express = require('express');
// const router = express.Router();
// const authenticateToken = require('../middlewares/auth.user.middleware');
// const { sendSMS } = require('../utils/sms');

// export default function userAccessRoutes (app, io, sequelize) {
//   const userController = require('../controllers/userController');
//   const userAccessController = require('../controllers/userAccessController');
//   const validateUserAccessData = require("../middlewares/validator/userAccessValidator");

//   // Registration (handled by userController)
//   router.post('/invite', authenticateToken, async (req, res) => {
//     try {
//       const { data, errors } = await validateUserAccessData( req.body );
//       if (errors.length > 0) {
//         return res.status(400).json({ errors });
//       }
//       data.inviteBy = req.user.id;
//       await userAccessController.invite(req, res, data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ status: "failed", message: 'Register failed on R', error: error.message });
//     }
//   });

//   // Registration (handled by userController)
//   router.post('/get-all', authenticateToken, async (req, res) => {
//     try {
//       // check if the request is from a verified user
//       const data = {};
//       data.userId = req.user.id;
//       await userAccessController.getAll(req, res, data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ status: "failed", message: 'Register failed on R', error: error.message });
//     }
//   });

//   // Approve
//   router.post('/approve', authenticateToken, async (req, res) => {
//     try {
//       // check if the request is from a verified user
//       const { data, errors } = await validateUserAccessData( req.body );
//       if (errors.length > 0) {
//         return res.status(400).json({ errors });
//       }
//       // check if the request is from a verified user
//       data.userId = req.user.id;
//       await userAccessController.approve(req, res, data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ status: "failed", message: 'Register failed on R', error: error.message });
//     }
//   });

//   router.get('/', (req, res) => {
//     res.status(200).send({ status: "success", message: 'Whatsapp API called' });
//   });

//   app.use('/api/useraccess', router);
// };