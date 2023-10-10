import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from 'node-fetch';
import categoryController from '../controllers/categoryController.js'

let categoryRouter = express.Router();

/**
 * return all category list
 */
categoryRouter.get('/',async (req,res)=>{
    categoryController.getCategories(req,res);
})

/**
 * return a single category obbject
 */
categoryRouter.get('/:id',async (req,res)=>{
    categoryController.getCategoryById(req,res);
})

/**
 * return a category content , either a subcategories list or products list
 */
categoryRouter.get('/:id/content',async (req,res)=>{
    categoryController.getContent(req,res);
})

/**
 * return all subcategory list for a category
 */
categoryRouter.get('/:id/subcategories',async (req,res)=>{
    console.log(`path of : /:id/subcategories `)
    categoryController.getContent(req,res);
    // categoryController.getAllSubCategories(req,res);
})

/**
 * return all products list for a category
 */
categoryRouter.get('/:id/products',async (req,res)=>{
    console.log(`path of : /:id/products `)
    categoryController.getAllProducts(req,res);
})


export default categoryRouter;
