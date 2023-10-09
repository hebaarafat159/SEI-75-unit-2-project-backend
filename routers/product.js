import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from 'node-fetch';
import productController from '../controllers/productController.js';

let productRouter = express.Router();


/** Prouducts Requests */


// return all products list for a category
productRouter.get('/',async (req,res)=>{
    productController.getProducts(req,res);
})


/** Prouducts Requests */

/**
 * request all measures from datbase
 */
productRouter.get('/allmeasurements',async (req,res)=>{
    productController.getAllMeasures(req,res);
})

/**
 * 
 */
productRouter.get('/:productId/measurements',async (req,res)=>{
    productController.getProductMeasures(req,res);
})

export default productRouter;
