const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', userController.getAllUsers);

// receives email, reset token is sent to email and user then sends email, token with new password for updation
router.post('/forgotPassword', userController.forgotPassword);

// receives token & new password
router.patch('/resetPassword/:resetToken', userController.resetPassword);

router.patch(
  '/updatePassword',
  authMiddleware.verifyToken,
  userController.updatePassword,
);

router.patch(
  '/updateData',
  authMiddleware.verifyToken,
  userController.updateData,
);

router.delete(
  '/deactivateAccount',
  authMiddleware.verifyToken,
  userController.deactivateAccount,
);

module.exports = router;
