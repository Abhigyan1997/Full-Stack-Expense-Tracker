const express = require('express');

const userauthenticate=require('../Middleware/auth')

const purchaseController = require('../controllers/purchase');

const Router=express.Router();
  
Router.get('/premiummembership',userauthenticate.authenticate,purchaseController.purchasepremium);

Router.post('/updatetransactionstatus',userauthenticate.authenticate,purchaseController.updateTransactionStatus);

module.exports = Router; 