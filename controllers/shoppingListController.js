import 'dotenv/config'
import mongoose from "mongoose";

import ShoppingList from '../models/shoppingListModel.js';
import listItem from '../models/listItemModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getUserShoppingList,
    addProductToShoppingList,
}

async function getUserShoppingList(req, res){
    const userId = req.param.userId;
    const filter = { "sharedWith.id": { "$in": [userId] } };
    let list = await ShoppingList.find(filter)
    return res.json(list);
}


async function addProductToShoppingList(req, res){

    // TODO remove test object
    // req.body = {
    //     product: {},
    //     listId:,
    //     quantity:,
    //     selectedMeasureId:
    // }
    // End test object 
    
    // const prouctId = req.body.product;
    // const shoopingListId = req.body.listId;
    // const quantity = req.body.quantity;
    // const selectedMeasureId = req.body.selectedMeasureId;
    
    // // save the current list if it's not exists
    // if(currrentList === null)
    // {

    // }
}