import Sequelize from "sequelize";

import User from '@/app/api/models/userModel'
import db from '@/utils/sequelize';

const { DataTypes } = Sequelize;


const Product = db.define('Products', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    user_id: {type: DataTypes.INTEGER, allowNull: true},
    enroll_date: {type: DataTypes.DATE, allowNull: true},
    row_status: DataTypes.BOOLEAN,
}, {
    freezeTableName: true
})

Product.belongsTo(User, 
    { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);

User.hasMany(Product, { foreignKey: 'user_id' });
export default Product;

(async()=>{
    await db.sync({alter : true});
})();