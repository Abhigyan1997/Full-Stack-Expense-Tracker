const express = require('express');

const userauthenticate=require('../Middleware/auth')

const expenseController = require('../controllers/expense');

const router = express.Router();

router.post('/expense/add-expense', userauthenticate.authenticate,expenseController.addExpense);

router.get('/expense/get-expenses',userauthenticate.authenticate, expenseController.getExpenses);

router.delete('/expense/delete-expense/:expenseid',userauthenticate.authenticate, expenseController.deleteExpense);  


module.exports = router;  