const Razorpay=require('razorpay');
const Order=require('../models/orders');

exports.purchasepremium = async(req, res)=>  {
    try{
        var rzp = new Razorpay({
            key_id : 'rzp_test_TWRaANheNLZPAL',
            key_secret : 'nmGfBDlN4HuJinLXKvN4y0s9'
        })
        const amount = 2500;

        rzp.orders.create({amount, currency:"INR"}, (err, order) =>{
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id, status: 'PENDING'})
            .then(()=>{
                return res.status(201).json({order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({message: 'Somthing went wrong', error:err})
    }
}

exports.updateTransactionStatus = async(req, res)=>{
    try{
        const {payment_id, order_id} = req.body;
        const order = await Order.findOne({where : {orderid : order_id}})
           const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL'})
           const promise2 = req.user.update({ ispremiumuser: true })

           Promise.all([promise1, promise2]).then(()=>{
               return res.status(202).json({success: true, message:"Transaction Successful"});
           }).catch((err)=>{
            throw new Error(err);
           })
    }catch(err){
        console.log(err);
    }
} 