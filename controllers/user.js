const User=require('../models/user');

exports.signup= async (req , res)=>{
    try{
    const{name, email, password}=req.body;
    if(name===undefined||name.length===0||password==null||password.length===0||email==null||email.lenght===0){
        return res.status(400).json({err:'Bad Paramete,Something is missing'})

    }
await User.create({name,email,password})
    res.status(201).json({message:"Succesfully created new user"})
}
catch(err){
    res.status(500).json(err);
}
}

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email == null || email.length === 0 || password == null || password.length === 0) {
        return res.status(400).json({ message: 'Bad response' });
      }
      const user = await User.findAll({ where: { email } });
      if (user.length > 0 && user[0].password === password) {
        res.status(200).json({ success: true, message: 'user logged in successfully' });
      } else if (user.length > 0 && user[0].password !== password) {
        res.status(400).json({ success: false, message: 'Password is incorrect' });
      } else {
        res.status(404).json({ success: false, message: 'user does not exist' });
      }
    } catch (err) {
      res.status(500).json({ message: err, success: false });
    }
  };