import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from 'node-fetch';
import shoppingListController from '../controllers/shoppingListController.js'

let listRouter = express.Router();

// return all products list for a category
listRouter.get('/',async (req,res)=>{
    shoppingListController.getAllShoppingList(req,res);
    // TODO remove testing this code
    // shoppingListController.addShoppingList(req,res);
    shoppingListController.addProductToShoppingList(req,res);
    //TODO End testing code //////// 
})


// return all products list for a category
listRouter.get('/:userId',async (req,res)=>{
    shoppingListController.getUserShoppingList(req,res);
})


listRouter.post('add/:id',async (req,res)=>{
    console.log(`add Shopping List = ${JSON.stringify(req.params.id)}`)
    shoppingListController.addShoppingList(req,res);
})

/**
 * add list item to specific shopping list
 */
listRouter.post('/:id/listItem/add',async (req,res)=>{ 
    console.log(`add List Item = ${JSON.stringify(req.params.id)}`)
    shoppingListController.addProductToShoppingList(req, res);
});
export default listRouter;
