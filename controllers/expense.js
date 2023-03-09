const Expense = require('../models/Expense');
const User = require('../models/user');
const sequelize=require('../util/database');
const UserServices=require('../Services/userservices');
const S3Services=require('../Services/s3services')
const DownloadedFile=require('../models/downloadFile')

exports.downloadExpense=async(req,res)=>{
  try{
    const expenses=await UserServices.getExpenses(req);
    //console.log(expenses);
    const stringifiedexpenses=JSON.stringify(expenses);
    
    const userId=req.user.id;
  
    const filename=`Expense${userId}/${new Date()}.txt`;
    const fileUrl=await S3Services.uploadtoS3(stringifiedexpenses,filename);
    DownloadedFile.create({
      url:fileUrl,
      userId:req.user.id
   })
  
    res.status(200).json({fileUrl,success:true})
  } catch(err){
    return res.status(500).json({ fileUrl:'',success: false, error: err });
  }

  
}

exports.addExpense = async (req, res, next)=> {
   const t = await sequelize.transaction();
 
   try {
     const { amount, description, category } = req.body;
     if (amount == undefined || amount.length == 0) {
       return res.status(400).json({ success: false, message: 'parameter is missing' });
     }
 
     const expense = await Expense.create({ amount, description, category, userId: req.user.id }, { transaction: t });
     const totalExpenses = Number(req.user.totalExpenses) + Number(amount);
     console.log(totalExpenses);
 
     await User.update({ totalExpenses: totalExpenses }, { where: { id: req.user.id }, transaction: t });
 
     await t.commit();
     res.status(200).json({ expense: expense });
   } catch (err) {
     await t.rollback();
     return res.status(500).json({ success: false, error: err }); 
   }
 }
 

exports.getExpense = async (req, res, next) => {
    try{
     const expenses = await Expense.findAll({where:{userId:req.user.id}});
     console.log(expenses);
    return res.status(200).json({expenses,success:true})
    }
     catch(err){
     console.log('Get expense is failing', JSON.stringify(err));
     return res.status(500).json({error: err, success: false})
    }
}

exports.deleteExpense = async (req, res) => {
   const expenseid = req.params.expenseid;
    try{
    await Expense.destroy({where: {id: expenseid,userId : req.user.id}});
    res.sendStatus(200);
    } catch(err){
       console.log(err);
       res.status(500).json(err)
    }
}
