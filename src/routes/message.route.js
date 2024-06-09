const express = require('express');
const catchAsync = require('../helpers/async.catch');
const { verifyAuth } = require('../middlewares/auth.verify');
const MessageController = require('../controllers/message.controller');
const router = express.Router();

router.use(catchAsync(verifyAuth));

router.post('/setup', catchAsync(MessageController.setUpConversation));
router.post('/send/:receiverId', catchAsync(MessageController.sendMessage));

module.exports = router;
