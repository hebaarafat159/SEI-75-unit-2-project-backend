import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from 'node-fetch';
import shoppingListController from '../controllers/shoppingListController.js'

let listRouter = express.Router();

// return all products list for a category
listRouter.get('/:userId',async (req,res)=>{
    shoppingListController.getUserShoppingList(req,res);
})




// /**
//  * return all category list
//  */
// categoryRouter.get('/',async (req,res)=>{
//     categoryController.getCategories(req,res);
// })
export default listRouter;
