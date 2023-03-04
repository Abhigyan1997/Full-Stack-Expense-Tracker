const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');

const User=require('./models/user');
const Expense=require('./models/Expense');
const Order=require('./models/orders');

var cors = require('cors');

const app = express();


app.use(cors());

app.set('view engine', 'ejs');
app.set('views', 'views');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const loginRoutes=require('./routes/user')
const purchaseRoutes=require('./routes/purchase')
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/user',loginRoutes)
app.use('/user',userRoutes);
app.use('/purchase',purchaseRoutes);
app.use(expenseRoutes);
app.use(errorController.get404);    

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);
 
sequelize
 .sync({alter:true})
 .then(result => {
    //console.log(result);
    app.listen(1000);
 })
 .catch(err => {
    console.log(err);
 })