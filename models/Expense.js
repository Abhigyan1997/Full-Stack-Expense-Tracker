const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = require('./user');

const Expense = sequelize.define('expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  amount: {
    type: Sequelize.INTEGER,  
    allowNull: false
  },
  description: {
    type: Sequelize.STRING, 
    allowNull: false
  }, 
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
   
  
});
Expense.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Expense, { foreignKey: 'userId' });


module.exports = Expense;