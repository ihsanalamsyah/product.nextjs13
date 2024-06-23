import Sequelize from "sequelize";

import db from '@/utils/sequelize';
import Users from '@/app/api/models/userModel'
import Products from '@/app/api/models/productModel'

const { DataTypes } = Sequelize;


const MapUserProduct = db.define('MapUserProduct', {
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    enroll_date: DataTypes.DATE
}, {
    freezeTableName: true
})


MapUserProduct.belongsTo(Users, 
    { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);
MapUserProduct.belongsTo(Products, 
    { foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);

Products.hasMany(MapUserProduct, { foreignKey: 'id' });
Users.hasMany(MapUserProduct, { foreignKey: 'id' });

export default MapUserProduct;

(async()=>{
    await db.sync();
})();