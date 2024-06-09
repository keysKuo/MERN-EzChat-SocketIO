const express = require('express');
const catchAsync = require('../helpers/async.catch');
const { verifyAuth } = require('../middlewares/auth.verify');
const MessageController = require('../controllers/message.controller');
const router = express.Router();

router.use(catchAsync(verifyAuth));

router.post('/send/:receiverId', catchAsync(MessageController.sendMessage));
router.get('/chat/:targetId', catchAsync(MessageController.getMessages));
router.post('/setup', catchAsync(MessageController.setUpConversation));

module.exports = router;
