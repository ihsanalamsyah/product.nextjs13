import Sequelize from "sequelize";

import Product from '@/app/api/models/productModel'
import db from '@/utils/sequelize';

const { DataTypes } = Sequelize;

const Image = db.define('Images', {
    blob: DataTypes.BLOB,
    product_id: DataTypes.INTEGER,
    row_status: DataTypes.BOOLEAN
}, {
    freezeTableName: true
})

Image.belongsTo(Product, 
    { foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
);

Product.hasOne(Image, { foreignKey: 'product_id' });

export default Image;


(async()=>{
    await db.sync({alter : true});
})();