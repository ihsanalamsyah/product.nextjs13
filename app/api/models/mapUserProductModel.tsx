import Sequelize from "sequelize";

import db from '@/utils/sequelize';
import Users from '@/app/api/models/userModel'
import Products from '@/app/api/models/productModel'

const { DataTypes } = Sequelize;


const MapUserProduct = db.define('MapUserProduct', {
    userID: DataTypes.INTEGER,
    productID: DataTypes.INTEGER,
    enrollDate: DataTypes.DATE,
    rowStatus: DataTypes.BOOLEAN
}, {
    freezeTableName: true
})


MapUserProduct.belongsTo(Users, 
    { foreignKey: 'userID', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);
MapUserProduct.belongsTo(Products, 
    { foreignKey: 'productID', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);

Products.hasMany(MapUserProduct, { foreignKey: 'id' });
Users.hasMany(MapUserProduct, { foreignKey: 'id' });

export default MapUserProduct;

(async()=>{
    await db.sync();
})();