  const User=require('../models/user');
  const bcrypt=require('bcrypt');
  const jwt=require('jsonwebtoken');

  exports.signup= async (req , res)=>{
    try{
    const{name, email, password}=req.body;
    if(name===undefined||name.length===0||password==null||password.length===0||email==null||email.lenght===0){
        return res.status(400).json({err:'Bad Paramete,Something is missing'})

    }
    const saltrounds=10;
    bcrypt.hash ( password,saltrounds,async(err , hash)=>{
      console.log(err);
      await User.create({name,email,password:hash})
      res.status(201).json({message:"Succesfully created new user"})
    })
  }
  catch(err){
    res.status(500).json(err);
  }
  }

  const generateAccessToken=(id,name,ispremiumuser)=>{ 
  return jwt.sign({userId:id,name:name,ispremiumuser},'SecretKey') 
}
   

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email == null || email.length === 0 || password == null || password.length === 0) {
        return res.status(400).json({ message: 'Bad response' });
      }
      const user = await User.findAll({ where: { email } });
      if (user.length > 0 ) {
        bcrypt.compare(password,user[0].password,(err,result)=>{
          if(err){
            throw new Error("Something went wrong")
          }
          if(result===true){
            res.status(200).json({success: true, message:'user logged in successfully',token:generateAccessToken(user[0].id,user[0].name,user[0].ispremiumuser) });
          }
        })
      } else if (user.length === 0) {
        return  res.status(404).json({ success: false, message: 'user does not exist' });
      } else {
        return res.status(400).json({ success: false, message: 'Password is incorrect' });
      }
    } catch (err) {
      res.status(500).json({ message: err, success: false });
    }
  };
  