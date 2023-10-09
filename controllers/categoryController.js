import 'dotenv/config'
import mongoose from "mongoose";
import Category from '../models/categoryModel.js';
import productController from '../controllers/productController.js'

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getCategories,
    getCategoryById,
    getContent,
    getAllSubCategories
}

/**
 * get all categories from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getCategories(req,res){
    const filter = {"isSubCategory":false};
    let categories = await Category.find(filter)
    return res.json(categories);
}

async function getCategoryObject(catId){
    const filter = {_id: `${catId}`};
    let category = await Category.findOne(filter)
    return category;
}

/**
 * get a category object from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getCategoryById(req,res){
     res.json(await getCategoryObject(req.params.id));
}

/**
 * called when the user select a category.
 * if it has subcategory, then it will return the subcategory list.
 * else it will return product list for that category. 
 * @param {*} req 
 * @param {*} res 
 */
async function getContent(req,res){
    const category_id = req.params.id;
    const filter = {$and: [{"parent_cat":{$eq: `${category_id}`} },
                            {"isSubCategory":{$eq:  true} } ] }
    
    let categories = await Category.find(filter);
    console.log(`Sub Category : ${JSON.stringify(categories)}`);
    
    // returen subcategories for a category
    if(categories.length > 0 ){
        return res.json(categories);
    }// case of load category's products list
    else{
        console.log(`Get Conetnt Products ........`);
        return  productController.getProductsOfCategory(req,res);
    }
}

/**
 * get all subcategory list from databse
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getAllSubCategories(req,res){
    const filter = {"isSubCategory":true};
    let categories = await Category.find(filter)
    return res.json(categories);
}

