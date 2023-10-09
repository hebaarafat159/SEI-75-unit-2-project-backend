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
 * form the request response in each cases success and error
 * @param {*} res 
 * @param {*} status // 200 for success , any error status
 * @param {*} body // requested data in case of success and "null" if the request failed
 * @param {*} message // error message or success message
 */
function retrunResponse(status, body, message){
    return {
        status: status,
        body: body,
        message: message
    };
}

/**
 * get all categories from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getCategories(req,res){
    try{
        const filter = {"isSubCategory":false};
        let categories = await Category.find(filter)
        res.send(retrunResponse(200,categories,''));
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    }
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
    try{
        res.send(retrunResponse(200,await getCategoryObject(req.params.id),''));
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    }
}

/**
 * called when the user select a category.
 * if it has subcategory, then it will return the subcategory list.
 * else it will return product list for that category. 
 * @param {*} req 
 * @param {*} res 
 */
async function getContent(req,res){
    try{
        const category_id = req.params.id;
        const filter = {$and: [{"parent_cat":{$eq: `${category_id}`} },
                                {"isSubCategory":{$eq:  true} } ] }
        
        let categories = await Category.find(filter);
        console.log(`Sub Category : ${JSON.stringify(categories)}`);
        
        // returen subcategories for a category
        if(categories.length > 0 ){
            res.send(retrunResponse(200,categories,''));
        }// case of load category's products list
        else{
            console.log(`Get Conetnt Products ........`);
            res.send(retrunResponse(200,productController.getProductsOfCategory(req,res),''));
        }
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    }
}

/**
 * get all subcategory list from databse
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getAllSubCategories(req,res){
    try{
        const filter = {"isSubCategory":true};
        let categories = await Category.find(filter)
        res.send(retrunResponse(200,categories,''));
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    }
}

