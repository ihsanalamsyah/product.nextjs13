import Sequelize from "sequelize";

import User from '@/app/api/models/userModel'
import db from '@/utils/sequelize';

const { DataTypes } = Sequelize;


const Product = db.define('Products', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    userID: {type: DataTypes.INTEGER, allowNull: true},
    enrollDate: {type: DataTypes.DATE, allowNull: true},
    rowStatus: DataTypes.BOOLEAN,
}, {
    freezeTableName: true
})

Product.belongsTo(User, 
    { foreignKey: 'userID', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);

User.hasMany(Product, { foreignKey: 'userID' });
export default Product;

(async()=>{
    await db.sync({alter : true});
})();