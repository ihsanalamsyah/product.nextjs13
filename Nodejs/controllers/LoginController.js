import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import env from 'dotenv';

env.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const checkUser = async (req, res) =>{
    try {
 
        const response = await User.findAll({
            where: {
                name: req.body.name
            }
        })
        if(response.length > 0){
            
            bcrypt.compare(req.body.password, response[0].toJSON().password, function(err, result){
                if (result){
                    //pembuatan token saat login success
                    const token = jwt.sign({
                        email: response[0].email,
                        name: response[0].name
                    }, JWT_SECRET, function(err, token){
                        return res.status(200).json({status: "OK", data: response[0], token: token});
                    })
                   
                }
                else{
                    return res.status(401).json({status: "Failed", msg: "password invalid"})
                }
            })
        }
        else{
            return res.status(401).json({status: "Failed", msg: "name invalid"});
        }
 
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}

export const signIn = (req, res) =>{
   
    try {
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(req.body.password, salt, async function(err, hash){
                const data = {
                    name : req.body.name,
                    email: req.body.email || null,
                    gender: req.body.gender || null,
                    password: hash
                }
                
                const alredyExist = await User.findAll({
                    where: {
                        name: req.body.name
                    }
                })
                if (alredyExist.length > 0){
                    return res.status(300).json({status: "Failed", msg: "name already exist", data: err});
                }
                else{
                    await User.create(data);
                    //pembuatan token saat login success
                    const token = jwt.sign({
                        email: data.email,
                        name: data.name
                    }, JWT_SECRET, function(err, token){
                        return res.status(200).json({status: "OK", data: data, token: token});
                    })

                }
            })
        })
       
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}

