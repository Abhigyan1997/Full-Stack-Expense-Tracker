const User = require('../models/user');

exports.addUser = async (req, res, next)=> {

    try{

       if(!req.body.phone){
          throw new Error('Phone number is mandatory');
       }
    const name = req.body.name;
    const email = req.body.email;
    const phonenumber = req.body.phone;

    const data = await User.create( {username: name, email: email, phonenumber: phonenumber})
    res.status(201).json({newUserDetails: data});
    console.log(res);
    } catch(err){
       res.status(500).json({
          error: err
       })
       
    } 

}

exports.getUser = async (req, res, next) => {
    try{
     const users = await User.findAll();
     res.status(200).json({allUsers: users})
    } catch(error){
     console.log('Get user is failing', JSON.stringify(error));
     res.status(500).json({error: err})
    }
}

exports.deleteUser = async (req, res) => {
    const uId = req.params.id;
    try{
    if(req.params.id == 'undefined'){
       console.log('ID is missing');
      return res.status(400).json({err: 'ID is missing'})
    }
    await User.destroy({where: {id: uId}});
    res.sendStatus(200);
    } catch(err){
       console.log(err);
       res.status(500).json(err)
    }
}