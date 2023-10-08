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
 * 
 */
categoryRouter.get('/:id/content',async (req,res)=>{
    categoryController.getContent(req,res);
})

export default categoryRouter;
