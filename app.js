const path = require('path');
const fs=require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');

const errorController = require('./controllers/error');

const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./util/database');

const User=require('./models/user');
const Expense=require('./models/Expense');
const Order=require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const downloadFile=require('./models/downloadFile')

var cors = require('cors');

const app = express();


app.use(cors());



app.set('view engine', 'ejs');
app.set('views', 'views');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const loginRoutes=require('./routes/user')
const purchaseRoutes=require('./routes/purchase')
const premiumFeature=require('./routes/premiumFeature')
const resetPasswordRoutes = require('./routes/resetpassword')

const accessLogStream=fs.createWriteStream(
   path.join(__dirname,'access.log'),
   {flags:'a'}
   );

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/user',loginRoutes)
app.use('/user',userRoutes);
app.use('/purchase',purchaseRoutes);
app.use(premiumFeature);
app.use(expenseRoutes);
app.use('/password', resetPasswordRoutes);

app.use(errorController.get404);    
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);
   
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);
 
sequelize 
 .sync()
 .then(result => {
    //console.log(result);
    app.listen(2000);
 })
 .catch(err => {
    console.log(err);
 }) 