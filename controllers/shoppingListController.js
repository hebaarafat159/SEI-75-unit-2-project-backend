import 'dotenv/config'
import mongoose from "mongoose";

import ShoppingList from '../models/shoppingListModel.js';
import ListItem from '../models/listItemModel.js';
import productController from '../controllers/productController.js'

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getAllShoppingList,
    getUserShoppingList,
    addProductToShoppingList,
    addShoppingList,
    deleteProductFromShoppingList,
    getShoppingListItems,
    updateListItemStatus,
    getShoppingListItemsCount
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


/**  Shopping list Queries */

async function getAllShoppingList(req, res){
    try{
        const filter = {};
        let list = await ShoppingList.find(filter)
        res.send(retrunResponse(200, list, ""));
    }catch (error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    }
}

/**
 * get all user shopping list from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getUserShoppingList(req, res){
    try{
        // console.log(`Get User Lits :::: ${req.params.userId}`)
        const filter = { "sharedWith":  req.params.userId  };
        let list = await ShoppingList.find(filter)
        // console.log(`Get User Lits :::: ${req.params.userId} :::: ${JSON.stringify(list)}`)
        res.send(retrunResponse(200, list, ""));
    }catch (error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    } 
}

/**
 * add new shopping list or updating the old one 
 * @param {*} req 
 * @param {*} res 
 */
async function addShoppingList(req,res){
    // TODO remove test data
    const listName = 'defaultList';//req.body.name;

    // TODO end Test code ///

    const list = await ShoppingList.findOne({"name":listName});
    console.log(`Default List : ${JSON.stringify(list)}` );
    if(list === null ){
        const newList = new ShoppingList({
            name:listName,
            listItems:[],
            lastUpdatedDate: new Date().getTime(),
            sharedWith:[],
        })

        newList.save()
        .then((newList) => {
            console.log(JSON.stringify(newList));
            res.send(retrunResponse(200, newList, ""));
        })
        .catch((error) => {
            console.log("Error" + error); 
            res.send(retrunResponse(error.code, null, error.name));
        });
    }   
    else{
        updateShoppingList(list);
    }
}

/**
 * this function add or remove item list from a shopping list items array, then updates shopping list in database
 * @param {*} forAdding // true if we add new item, false if we delete an item
 * @param {*} listId // shopping list Id
 * @param {*} listItemId // item id
 */
async function  updateShoppingItemsArray(forAdding, listId, listItemId)
{
    try{
        // get shopping list object
        const listObject = await ShoppingList.findOne({"_id":listId});
        console.log(`Updating .... List    : ${JSON.stringify(listObject)}` );
        if(forAdding)
        {
            // add item to shopping list items array
            listObject.listItems.push(listItemId);
        }else{
            //TODO handle remove item list from array
        }
        // update shopping list 
        await updateShoppingList(listObject);
    }catch(error){
        console.log("Error" + error); 
        return retrunResponse( error.code, null, error.name);
    }
    
}

/**
 * add user id to sharing list array in a list
 * @param {*} forAdding 
 * @param {*} listId 
 * @param {*} userId 
 * @returns 
 */
async function  updateShoppingListUsers(forAdding, listId, userId)
{
    try{
        // get shopping list object
        const listObject = await ShoppingList.findOne({"_id":listId});
        console.log(`Updating .... List    : ${JSON.stringify(listObject)}` );
        if(forAdding)
        {
            // add user to shopping list items array
            listObject.sharedWith.push(userId);
        }else{
            //TODO handle remove user from array
        }
        // update shopping list 
        await updateShoppingList(listObject);
    }catch(error){
        console.log("Error" + error); 
        return retrunResponse( error.code, null, error.name);
    }
    
}

/**
 * delete shopping list and it's items 
 * @param {*} listId 
 * @returns 
 */
async function deleteShoppingList(listId){
    try{
        const item = await ShoppingList.findOne({"_id": listId})
        if(item !== null && item.listItems.length > 0)
        {
            await ListItem.deleteMany({ "listItems._id": { "$in": [item.listItems] } });
        }
        ShoppingList.findByIdAndDelete({"_id": listId})
        // console.log(JSON.stringify(itemList));
        return retrunResponse(200, null, "");
    }catch(error) {
        console.log("Error" + error); 
        return retrunResponse(error.code, null, error.name);
    }
}

/**
 * update a shopping list
 * @param {*} updatedList 
 */
async function updateShoppingList(updatedList){
    updatedList.lastUpdatedDate = new Date().getTime();
    console.log(`****** Object: ${JSON.stringify(updatedList)} ------ Updated shopping list time : ${updatedList.lastUpdatedDate}`);
    await ShoppingList.findOneAndUpdate({"_id": updatedList._id},updatedList)
    .then((updatedList) => {
        console.log(JSON.stringify(updatedList));
        return retrunResponse(200, updatedList, "");
    })
    .catch((error) => {
        console.log("Error" + error); 
        return retrunResponse( error.code, null, error.name);
    });
}

/** List Item Queries */

/**
 * get all items of a shopping list from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getShoppingListItems(req, res){
    try{
        const filter = {"list_id": req.params.id};
        let list = await ListItem.find(filter);
        console.log(`get list items ::::: = ${req.params.id} :: \n\n${JSON.stringify(list)}`);
        res.send(retrunResponse(200, list, ""));
    }catch (error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    } 
}

/**
 * add product to a current selected shopping list
 * @param {*} req 
 * @param {*} res 
 */
async function addProductToShoppingList(req, res){
    const itlemObject = {
        item_id: req.body.item_id,
        product_id: req.body.product_id,
        quantity: req.body.quantity,
        measure_id: req.body.measure_id,
        lastUpdatedDate: req.body.lastUpdatedDate,
        hasBrought:req.body.hasBrought,
        list_id:req.body.list_id,
        measure: req.body.measure,
        product: req.body.product, 
    }
    
    // get item list object if exsists 
    const item = await ListItem.findOne({"_id":itlemObject.item_id});
    // console.log(`adding .... item   : ${JSON.stringify(item)}` );
    if(item === null ){
        const listItem = new ListItem(itlemObject)
        try{

            // save new list item on database
            await listItem.save()
             // TODO handle adding item id to shopping list items array
            res.send(retrunResponse(200, listItem, ""));
            
        }catch(error) {
            console.log(error);
            res.send(retrunResponse(error.code, null, error.name));
        };
    }else{
        // TODO update object with new values 
        // console.log(`Update item ---> ${item._id}`)
        item.measure_id = itlemObject.measure_id;
        item.quantity = itlemObject.quantity;
        item.measure = itlemObject.measure
        const response = await updateProductInShoppingList(item._id,item.measure_id,item.measure,item.quantity);
        // console.log(`\n \n \n Updated Item in List respond :::::: ${JSON.stringify(response)}`);
        res.send(response);
    }
}

/**
 * update saved item list quanitity , measurement and lastUpdated date
 * @param {*} measureId 
 * @param {*} quantity 
 * @returns 
 */
async function updateProductInShoppingList(itemId,measureId,measure, quantity){
    const lastUpdatedDate = new Date().getTime();
    // console.log(`****** list item object: ${quantity} ------ 
    // Updated shopping list time : ${lastUpdatedDate}`);
    try{
        const itemList = await ListItem.findOneAndUpdate({"_id": itemId},
        {"measure_id": measureId,"measure": measure, "lastUpdatedDate":lastUpdatedDate,"quantity":quantity})
    
        // console.log(JSON.stringify(itemList));
        return retrunResponse(200, itemList, "");
    }catch(error) {
        console.log("Error" + error); 
        return retrunResponse(error.code, null, error.name);
    }
}

/**
 * remove item from a selected shopping list
 * @param {*} listId 
 * @param {*} itemId 
 * @returns 
 */
async function deleteProductFromShoppingList(req,res){
    try{
        await ListItem.findOneAndDelete({"_id": req.body.item_id},{"list_id": req.body.list_id})
        res.send(retrunResponse(200, null, ""));
    }catch(error) {
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    }
}

/**
 * change item list status (has been brought or not )
 * @param {*} itemId 
 * @param {*} status 
 * @returns 
 */
async function updateListItemStatus(req,res){
    const lastUpdatedDate = new Date().getTime();
    // console.log(`******Updated status list item object: ${req.body.hasBrought} ------ ${req.body._id}  
    // Updated shopping list time : ${lastUpdatedDate}`);
    try{
        const itemList = await ListItem.findOneAndUpdate({"_id": req.body._id}, 
        {"hasBrought":req.body.hasBrought, "lastUpdatedDate":lastUpdatedDate})
    
        // console.log(JSON.stringify(itemList));
        return retrunResponse(200, itemList, "");
    }catch(error) {
        console.log("Error" + error); 
        return retrunResponse(error.code, null, error.name);
    }
}

async function getShoppingListItemsCount(req, res){
    try{
        const filter = {"list_id": req.params.id};
        let count = await ListItem.count(filter);
        console.log(`List count ::::: = count `);
        res.send(retrunResponse(200, count, ""));
    }catch (error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    } 
}