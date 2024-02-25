import express  from "express";
import cors from "cors";
import UserRouter from './routes/UserRoute.js';
import ProductRouter from './routes/ProductRoute.js';
import LoginRouter from './routes/LoginRoute.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(UserRouter);
app.use(ProductRouter);
app.use(LoginRouter);
app.listen(4000, ()=> console.log("server up and running..."));