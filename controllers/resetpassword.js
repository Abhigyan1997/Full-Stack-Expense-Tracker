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
        subject: 'Reset Password',
        textContent: `Follow the link and reset password`,
        htmlContent: `Click on the link below to reset password <br> <a href="http://localhost:1000/password/resetpassword/${id}">Reset password</a>`,

    }).then((response)=>{
        //console.log('after transaction');
        return res.status(202).json({sucess: true, message: "password mail sent Successful"});
    }).catch(err=>console.log(err))
}

exports.resetPassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}


exports.updatePassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}
