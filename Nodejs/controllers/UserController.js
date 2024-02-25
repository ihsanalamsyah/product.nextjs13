import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) =>{
    try {
        const response = await User.findAll();
        return res.status(200).json({status: "OK",msg: "Success find one", data: response});
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}

export const getUserById = async (req, res) =>{
    try {
        const response = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({status: "OK",msg: "Success find one", data: response});
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}

export const createUser = (req, res) =>{
   
    try {
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(req.body.password, salt, async function(err, hash){
                const data = {
                    name : req.body.name,
                    email: req.body.email,
                    gender: req.body.gender,
                    password: hash
                }
                
                const alredyExist = await User.findAll({
                    where: {
                        name: req.body.name
                    }
                })
                if (alredyExist.length > 0){
                    return res.status(200).json({status: "Failed", msg: "name already exist", data: err.message});
                }
                else{
                    User.create(data);
                    return res.status(201).json({status: "OK", msg: "User Created", data: res});
                }
            })
        })
       
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}

export const updateUser = async (req, res) =>{
    try {
        await User.update(req.body,{
            where: {
                id:req.params.id
            }
        });
        return res.status(200).json({status: "OK", msg: `User ${req.params.id} Updated`, data: res} );
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}

export const deleteUser = async (req, res) =>{
    try {
        await User.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({status: "OK",msg: `User ${req.params.id} Deleted`, data: res});
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}