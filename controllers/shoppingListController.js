import 'dotenv/config'
import mongoose from "mongoose";

import ShoppingList from '../models/shoppingListModel.js';
import ListItem from '../models/listItemModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getAllShoppingList,
    getUserShoppingList,
    addProductToShoppingList,
    addShoppingList
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
    const filter = {};
    let list = await ShoppingList.find(filter)
    return res.json(list);
}

/**
 * get all user shopping list from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getUserShoppingList(req, res){
    const userId = req.param.userId;
    const filter = { "sharedWith.id": { "$in": [userId] } };
    let list = await ShoppingList.find(filter)
    return res.json(list);
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
 * add product to a current selected shopping list
 * @param {*} req 
 * @param {*} res 
 */
async function addProductToShoppingList(req, res){

    // TODO remove test object
    const itemId = '65241633ecbc65c4e3ac447c' 
    const itlemObject = {
        product_id: '6521bb2ff39360ef56c544f2',
        quantity:3,
        measure_id:'6521bc7cf39360ef56c544f6',
        lastUpdatedDate: new Date().getTime(),
        hasBrought:false,
        list_id:'6523ec21549acd91ef6ac71a'
    }
    // TODO End test object 
    

    // get item list object if exsists 
    const item = await ListItem.findOne({"_id":itemId});
    console.log(`adding .... item   : ${JSON.stringify(item)}` );
    if(item === null ){
        const listItem = new ListItem({
            product_id: itlemObject.product_id,
            quantity: itlemObject.quantity,
            measure_id: itlemObject.measure_id,
            lastUpdatedDate: new Date().getTime(),
            hasBrought:false,
            list_id: itlemObject.list_id
        });
        
        try{

            // save new list item on database
            await listItem.save()
             // TODO handle adding item to shopping list items array
            res.send(retrunResponse(200, listItem, ""));
            
        }catch(error) {
            console.log(error);
            res.send(retrunResponse(error.code, null, error.name));
        };
    }else{
        // TODO update object with new values 
        console.log(`Update item ---> ${item._id}`)
        item.quantity = 34;
        updateProductInShoppingList(item._id,item.measure_id,item.quantity);
    }
}

/**
 * update saved item list quanitity , measurement and lastUpdated date
 * @param {*} measureId 
 * @param {*} quantity 
 * @returns 
 */
async function updateProductInShoppingList(itemId,measureId, quantity){
    const lastUpdatedDate = new Date().getTime();
    console.log(`****** list item object: ${quantity} ------ 
    Updated shopping list time : ${lastUpdatedDate}`);
    try{
        const itemList = await ListItem.findOneAndUpdate({"_id": itemId},
        {"measure_id": measureId, "lastUpdatedDate":lastUpdatedDate,"quantity":quantity})
    
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
async function deleteProductFromShoppingList(listId,itemId){
    try{
        const item = await ListItem.findOneAndUpdate({"_id": itemId},{"list_id": listId})
    
        // console.log(JSON.stringify(itemList));
        return retrunResponse(200, null, "");
    }catch(error) {
        console.log("Error" + error); 
        return retrunResponse(error.code, null, error.name);
    }
}