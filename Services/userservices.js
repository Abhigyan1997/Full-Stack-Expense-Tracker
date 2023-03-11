const getExpenses=(req)=>{
    return req.user.getExpenses();
}
const countExpenses =(user,where)=>{
    return user.countExpenses(where);
}
module.exports={
    getExpenses,
    countExpenses
}