import 'dotenv/config'
import mongoose from "mongoose";
import Product from '../models/productModel.js';
import Measurement from '../models/measurementModel.js'

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getProducts,
    getProductsOfCategory,
    getProductById,
    getProductObject,

    getAllMeasures,
    getMeasurementById,
    getProductMeasures
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

/**  Products Queries */

/**
 * return all products from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getProducts(req,res){
    try{
        const filter = {};
        let products = await Product.find(filter).populate(["category_id","measures"]);
        res.send(retrunResponse(200,products,''));
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    } 
}

async function getProductById(req,res){
    try{
        const filter = {};
        const productObj = await res.json(getProductObject(req.params.id));
        res.send(retrunResponse(200,productObj,''));
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    } 
   
}

/**
 * return a specific product from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getProductObject(productId){
    const filter = {"_id": productId};
    let product = await Product.findOne(filter).populate(["category_id","measures"])
    return product;
}

/**
 * return all products for a category
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getProductsOfCategory(req,res){
    try{
        const filter = {"category_id": `${req.params.id}`};
        const products = await Product.find(filter).populate(["category_id","measures"])
        res.send(retrunResponse(200,products,'products'));
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    } 
   
}

/**  Measurements Queries */

/**
 * return all measeremnets from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getAllMeasures(req,res){
    try{
        const filter = {};
        const measures = await Measurement.find(filter)
        res.send(retrunResponse(200,measures,''));
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    }   
}

/**
 * return a specific measurement object from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getMeasurementById(req,res){
    try{
        const filter = {"_id": `${req.params.id}`};
        const measure = await Measurement.findOne(filter)
        res.send(retrunResponse(200,measure,''));
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    } 
}

/**
 * return a product mearement list from database
 * @param {*} req 
 * @param {*} res 
 */
async function getProductMeasures(req, res){
 
    try{
        const productObj = await getProductObject(req.params.productId);
        console.log(`selected object : ${JSON.stringify(productObj)}`);
        const list = productObj.measures;
        console.log(`measures : ${list}`);

        if(list!==undefined && list.length > 0){
            const filter = {"_id": {$in: list}};
            let measure = await Measurement.find(filter);
            console.log(`measure object : ${JSON.stringify(measure)}`);
            res.send(retrunResponse(200,measure,''));
        }
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    } 
   
}