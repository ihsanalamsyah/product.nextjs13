import Sequelize from "sequelize";

import db from '@/utils/sequelize';

const { DataTypes } = Sequelize;

const Image = db.define('Images', {
    blob: DataTypes.BLOB,
    productID: DataTypes.INTEGER,
    rowStatus: DataTypes.BOOLEAN
}, {
    freezeTableName: true
})


export default Image;


(async()=>{
    await db.sync({alter : true});
})();