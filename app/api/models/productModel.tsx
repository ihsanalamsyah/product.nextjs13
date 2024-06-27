import Sequelize from "sequelize";

import Users from '@/app/api/models/userModel'
import db from '@/utils/sequelize';

const { DataTypes } = Sequelize;


const Product = db.define('Products', {
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    enrollDate: DataTypes.DATE,
    rowStatus: DataTypes.BOOLEAN,
}, {
    freezeTableName: true
})

Product.belongsTo(Users, 
    { foreignKey: 'userID', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);

Users.hasMany(Product, { foreignKey: 'id' });
export default Product;

(async()=>{
    await db.sync({alter : true});
})();