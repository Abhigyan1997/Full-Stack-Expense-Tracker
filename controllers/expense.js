const Expense = require('../models/expense');

exports.addExpense = async (req, res, next)=> {

   try{   
   //    if(!req.body.phone){
   //       throw new Error('Phone number is mandatory');
   //    }
   const amount = req.body.amount;
   const description = req.body.description;
   const category = req.body.category;

   const data = await Expense.create( {amount: amount, description: description, category: category} )
   res.status(201).json({newExpense: data});
   } catch(err){
      res.status(500).json({
         error: err
      })

   } 

}

exports.getExpense = async (req, res, next) => {
    try{
     const expenses = await Expense.findAll();
     console.log(expenses);
     res.status(200).json({allExpenses: expenses})
    } catch(error){
     console.log('Get expense is failing', JSON.stringify(error));
     res.status(500).json({error: err})
    }
}

exports.deleteExpense = async (req, res) => {
    const eId = req.params.id;
    try{
    if(req.params.id == 'undefined'){
       console.log('ID is missing');
      return res.status(400).json({err: 'ID is missing'})
    }
    await Expense.destroy({where: {id: eId}});
    res.sendStatus(200);
    } catch(err){
       console.log(err);
       res.status(500).json(err)
    }
}