const uuid = require('uuid');
const sib = require('sib-api-v3-sdk');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Forgotpassword = require('../models/forgotpassword');
const dotenv = require('dotenv');

dotenv.config();

exports.forgotPassword = async (req,res,next) => {
    const {email} =req.body ;

    const user = await User.findOne({where:{email}});
    const id = uuid.v4();
  
    user.createForgotpassword({id,active:true})
    .catch(err=>{ throw new Error(err)})
    
    console.log(email);

    const client = sib.ApiClient.instance
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.API_KEY

    const tranEmailApi = new sib.TransactionalEmailsApi()
    const sender = {
        email : 'alokabhigyan65@gmail.com',
        name : 'Alok Abhigyan'
    }
    const recievers = [
        {
            email : email,
        },
    ]
    console.log(recievers);

    tranEmailApi.sendTransacEmail({
        sender,
        to: recievers,
        subject: 'forgotpass please reset',
        textContent: `Follow the link and reset password`,
        htmlContent: `Click on the link below to reset password <br> <a href="http://localhost:1000/password/resetpassword/${id}">Reset password</a>`,

    }).then((response)=>{
        //console.log('after transaction');
        return res.status(202).json({sucess: true, message: "password mail sent Successful"});
    }).catch(err=>console.log(err))
}

exports.resetPassword = async (req,res,next) => {
    try {
        console.log('into reset')

        let id = req.params.id;

        let forgotpasswordRequest = await ForgotPassword.findOne({where:{id}})

        if(!forgotpasswordRequest){
            return res.status(404).json({msg: 'User desnt exist'})
        }

        forgotpasswordRequest.update({active:false})
        res.status(200).send(`<html>
        <script>
            function formsubmitted(e){
                e.preventDefault();
                console.log('called')
            }
        </script>
        <form action="/passwordpassword/update/${id}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
        </form>
    </html>`)

    res.end();
    } catch (error) {
        return res.status(500).json({ message: error});
    }
}
exports.updatePassword = async (req,res,next) => {
    console.log('into update');
    const { newpassword } = req.query;
    const { id } = req.params;

    console.log((newpassword) ) 
    try {
        const resetpasswordrequest  = await ForgotPassword.findOne({where:{id}})
        const user = await User.findOne({where:{id:resetpasswordrequest.userId }})
        if(!user){
            return res.status(404).json({ error: 'No user Exists', success: false})
        }

        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err,salt) {
            if(err){
                console.log(err)
                throw new Error(err);
            }
            bcrypt.hash(newpassword, salt, async(err, hash)=>{
                await user.update({ password:hash })
                res.status(201).json({message: 'Successfuly update the new password'})
            });
        })
    } catch (error) {
        return res.status(403).json({ error, success: false } )
    }
}