import 'dotenv/config'
import mongoose from "mongoose";
import Product from '../models/productModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getProducts,
    getProductsOfCategory
}

/**
 * return all products from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getProducts(req,res){
    const filter = {};
    let products = await Product.find(filter)
    return res.json(products);
}

/**
 * return all products for a category
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getProductsOfCategory(req,res){
    const filter = {"category_id": `${req.params.id}`};
    let products = await Product.find(filter)
    return res.json(products);
}

