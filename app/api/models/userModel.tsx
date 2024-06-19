import Sequelize from "sequelize";

import db from '@/utils/sequelize';

const { DataTypes } = Sequelize;

const User = db.define('Users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    password:  DataTypes.STRING,
    role:  DataTypes.STRING
}, {
    freezeTableName: true
})


export default User;


(async()=>{
    await db.sync({alter : true});
})();