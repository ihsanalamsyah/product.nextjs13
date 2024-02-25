import Product from '../models/ProductModel.js';

export const getProducts = async (req, res) =>{
    try {
        const response = await Product.findAll();
        return res.status(200).json({status: "OK", msg: "Get Product", data: response});
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}

export const getProductById = async (req, res) =>{
    try {
        const response = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({status: "OK", msg: "Get Product"});
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}

export const createProduct = async (req, res) =>{
    try {
        if(isNaN(req.body.price)){
            return res.status(300).json({status: "Failed", msg: "Price is NaN"});
        }
        await Product.create(req.body);
        return res.status(201).json({status: "OK", msg: "Product Created"});
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}

export const updateProduct = async (req, res) =>{
    try {
        if(isNaN(req.body.price)){
            return res.status(300).json({status: "Failed", msg: "Price is NaN"});
        }
        await Product.update(req.body,{
            where: {
                id:req.params.id
            }
        });
        return res.status(200).json({status: "OK", msg: `Product ${req.params.id} Updated`});
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}

export const deleteProduct = async (req, res) =>{
    try {
        await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({status: "OK", msg: `Product ${req.params.id} Deleted`});
    }
    catch (error){
        return res.status(300).json({status: "Failed", msg: error.message});
    }
}