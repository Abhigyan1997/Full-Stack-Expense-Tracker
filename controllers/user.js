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