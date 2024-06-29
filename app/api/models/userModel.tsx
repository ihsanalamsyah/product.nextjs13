import Sequelize from "sequelize";

import db from '@/utils/sequelize';

const { DataTypes } = Sequelize;

const User = db.define('Users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    password:  DataTypes.STRING,
    role:  DataTypes.STRING,
    rowStatus: DataTypes.BOOLEAN
}, {
    freezeTableName: true
})

export default User;

(async()=>{
    await db.sync({alter : true});
})();