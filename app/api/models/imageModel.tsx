import Sequelize from "sequelize";

import Product from '@/app/api/models/productModel'
import db from '@/utils/sequelize';

const { DataTypes } = Sequelize;

const Image = db.define('Images', {
    blob: DataTypes.BLOB,
    productID: DataTypes.INTEGER,
    rowStatus: DataTypes.BOOLEAN
}, {
    freezeTableName: true
})

Image.belongsTo(Product, 
    { foreignKey: 'productID', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);

Product.hasOne(Image, { foreignKey: 'productID' });

export default Image;


(async()=>{
    await db.sync({alter : true});
})();