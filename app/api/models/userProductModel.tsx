import Sequelize from "sequelize";

import db from '@/utils/sequelize.jsx';
import Users from '../models/userModel';
import Products from '../models/productModel';

const { DataTypes } = Sequelize;


const UserProduct = db.define('UserProduct', {
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    enroll_date: DataTypes.DATE
}, {
    freezeTableName: true
})


UserProduct.belongsTo(Users, 
    { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);
UserProduct.belongsTo(Products, 
    { foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);

Products.hasMany(UserProduct, { foreignKey: 'id' });
Users.hasMany(UserProduct, { foreignKey: 'id' });

export default UserProduct;

(async()=>{
    await db.sync({alter : true});
})();