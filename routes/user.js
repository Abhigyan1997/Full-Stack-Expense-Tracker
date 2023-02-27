const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/signup', userController.signup);

// router.get('/user/get-users', userController.getUser);

// router.delete('/user/delete-user/:id', userController.deleteUser);


module.exports = router;