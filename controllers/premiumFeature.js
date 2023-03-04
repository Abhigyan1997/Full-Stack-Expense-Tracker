const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.getUserLeaderBoard = async (req, res)=>{
    try{
         const user = await User.findAll();
         const expenses = await Expense.findAll();
         const userAggregatedExpenses = {}
         expenses.forEach((expense) => {
            if( userAggregatedExpenses[expense.userId] ){
                userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.amount
            } else{
                userAggregatedExpenses[expense.userId] = expense.amount
            }
         });

         var userLeaderBoardDetails = [];
         user.forEach((user)=>{
            userLeaderBoardDetails.push({name:user.name, total_cost: userAggregatedExpenses[user.id] || 0 })
         })
         userLeaderBoardDetails.sort((a,b)=> b.total_coast-a.total_coast)
         console.log(userLeaderBoardDetails);
         res.status(200).json(userLeaderBoardDetails);

    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}