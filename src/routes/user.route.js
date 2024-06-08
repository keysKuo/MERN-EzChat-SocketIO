const express = require('express');
const catchAsync = require('../helpers/async.catch');
const { verifyAuth } = require('../middlewares/auth.verify');
const UserController = require('../controllers/user.controller');
const router = express.Router();

router.use(catchAsync(verifyAuth));

router.get("/list", catchAsync(UserController.getOtherUsers));

router.get('/history', catchAsync(UserController.getHistoryConversations));

router.get('/history_v2', catchAsync(UserController.getHistoryConversations_v2));

router.post('/search', catchAsync(UserController.searchUserByEmail));

router.post('/setup', catchAsync(UserController.setUpConversation));

module.exports = router;
