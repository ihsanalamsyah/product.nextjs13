import { Sequelize } from "sequelize";
import env from "dotenv";
import mysql2 from 'mysql2';

env.config();

const db = new Sequelize(process.env.DB_DBNAME as string, process.env.DB_USERNAME as string, process.env.DB_PASSWORD as string,{
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string),
    dialect: 'mysql',
    dialectModule: mysql2
});

export default db;