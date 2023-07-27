const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// receives email, reset token is sent to email and user then sends email, token with new password for updation
router.post('/forgotPassword', userController.forgotPassword);

// receives token & new password
router.patch('/resetPassword/:resetToken', userController.resetPassword);

router.use(authMiddleware.verifyToken); // authentication added to all successive routes

router.get(
  '/',
  authMiddleware.verifyAuthorization('admin'),
  userController.getAllUsers,
);

router.get('/myInfo', userController.getMyInfo);

router.patch('/updatePassword', userController.updatePassword);

router.patch('/updateData', userController.updateData);

router.delete('/deactivateAccount', userController.deactivateAccount);

module.exports = router;
