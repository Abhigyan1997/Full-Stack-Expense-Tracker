const Expense = require('../models/expense');
const User = require('../models/user');

exports.addExpense = async (req, res, next)=> {
   const {amount, description, category} = req.body;
   if(amount== undefined || amount.length==0){
      return res.status(400).json({seccess: false, message:'parameter is missing'})
  }

   Expense.create({amount, description, category,userId: req.user.id})
   .then(expense =>{
      const totalExpenses = Number(req.user.totalExpenses)+ Number(amount)
      console.log(totalExpenses);
      User.update({
          totalExpenses: totalExpenses
      },{
          where : {id:req.user.id}
      })
      .then(async()=>{
          res.status(200).json({expense:expense})
      })
      .catch(async(err)=>{
          return res.status(500).json({success: false, error:err})
      })
      .catch(async(err)=>{
          return res.status(500).json({success:false, error:err})
      })
  })
}

exports.getExpense = async (req, res, next) => {
    try{
     const expenses = await Expense.findAll({where:{userId:req.user.id}});
     console.log(expenses);
    return res.status(200).json({expenses,success:true})
    } catch(err){
     console.log('Get expense is failing', JSON.stringify(err));
     return res.status(500).json({error: err, success: false})
    }
}

exports.deleteExpense = async (req, res) => {
   const expenseid = req.params.expenseid;
    try{
    await Expense.destroy({where: {id: expenseid}});
    res.sendStatus(200);
    } catch(err){
       console.log(err);
       res.status(500).json(err)
    }
}
