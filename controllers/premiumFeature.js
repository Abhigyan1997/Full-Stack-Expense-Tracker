const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.getUserLeaderBoard = async (req, res)=>{
    try{
        const leaderboardofUsers = await User.findAll({
            attributes: ['id','name',[sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],
            include:[
                {
                  model: Expense,
                  attributes: []
                }
            ],
            group:['user.id'],
            order:[['total_cost','DESC']]
        });
        res.status(200).json(leaderboardofUsers);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}