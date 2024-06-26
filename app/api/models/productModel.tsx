import Sequelize from "sequelize";

import db from '@/utils/sequelize';

const { DataTypes } = Sequelize;


const Product = db.define('Products', {
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    rowStatus: DataTypes.BOOLEAN
}, {
    freezeTableName: true
})

export default Product;

(async()=>{
    await db.sync({alter : true});
})();