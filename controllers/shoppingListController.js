import 'dotenv/config'
import mongoose from "mongoose";

import ShoppingList from '../models/shoppingListModel.js';
import ListItem from '../models/listItemModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getAllShoppingList,
    getUserShoppingList,
    addProductToShoppingList,
    addShoppingList,
    deleteProductFromShoppingList,
    getShoppingListItems,
    updateListItemStatus,
    getShoppingListItemsCount,
    updateShoppingListUsers,
    getListItemByName
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
        let list = await ShoppingList.find(filter).populate(["listItems","sharedWith"]);
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
        let list = await ShoppingList.find(filter).populate(["listItems","sharedWith"]);
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
    console.log(`add Shopping List = ${JSON.stringify(req.params.userId)}`)
    // const userEmail = req.params.userId;
    const listName = req.body.listName;
    const list = await ShoppingList.findOne({"name":listName}).populate(["listItems","sharedWith"]);
    if(list === null ){
        console.log(`Default List : ${JSON.stringify(list)}` );
        
        const newList = new ShoppingList({
            name:req.body.listName,
            listItems:req.body.items,
            lastUpdatedDate: new Date().getTime(),
            sharedWith:req.body.sharedEmails,
            isSelected : true
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
        const listObject = await ShoppingList.findOne({"_id":listId}).populate(["listItems","sharedWith"]);
        console.log(`Updating .... List    : ${JSON.stringify(listObject)}` );
        if(forAdding)
        {
            // add item to shopping list items array
            if(!listObject.listItems.includes(listItemId))
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
    await ShoppingList.findOneAndUpdate({"_id": updatedList._id},updatedList).populate(["listItems","sharedWith"])
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
        let list = await ListItem.find(filter).populate(["product_id","list_id","measure_id"]);
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
    let id = req.body._id;
    let item = null; 
    if(id === '-1')
    { 
        item = new ListItem(
        {
                product_id: req.body.productObj._id,
                quantity: req.body.quantity,
                measure_id: req.body.selectedMeasure._id,
                lastUpdatedDate: new Date().getTime(),
                hasBrought:req.body.status,
                list_id: req.params.id
        });
        try{
            // save new list item on database
            await item.save();
            await updateShoppingItemsArray (true, item.list_id, item._id);
            res.send(retrunResponse(200, item, ""));
            
        }catch(error) {
            console.log(error);
            res.send(retrunResponse(error.code, null, error.name));
        };
    } else{
        // get item list object if exsists 
        //item = await ListItem.findOne({"_id":id})//.populate(["product_id","list_id","measure_id"]);
        const response = await updateProductInShoppingList(req.body._id,req.body.selectedMeasure._id,req.body.quantity,req.body.status);
        res.send(response);
    }   
}

/**
 * update saved item list quanitity , measurement and lastUpdated date
 * @param {*} measureId 
 * @param {*} quantity 
 * @returns 
 */
async function updateProductInShoppingList(itemId,measureId, quantity, status){
    const lastUpdatedDate = new Date().getTime();
    // console.log(`****** list item object: ${quantity} ------ 
    // Updated shopping list time : ${lastUpdatedDate}`);
    try{
        const itemList = await ListItem.findOneAndUpdate({"_id": itemId},
        {"measure_id": measureId, "lastUpdatedDate":lastUpdatedDate,"quantity":quantity,"hasBrought":status}).populate(["product_id","list_id","measure_id"])
    
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
        if(req.body._id !== '-1')
        { 
            await ListItem.findOneAndDelete({"_id": req.body._id},{"list_id": req.params.id})
            res.send(retrunResponse(200, null, ""));
        }
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
        let id = req.body._id;
        if(id === '-1')
        { 
            const response = await updateProductInShoppingList(req.body._id,req.body.selectedMeasure._id,req.body.quantity,req.body.status);
            res.send(retrunResponse(200,response,''));
        }
    }catch(error) {
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
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

/**
 * add user id to sharing list array in a list
* @returns 
 */
async function updateShoppingListUsers(req,res)
{
    console.log(`share List Item = ${JSON.stringify(req.params.id)}`)
    try{
        // get shopping list object
        let listObject = await ShoppingList.findOne({"_id":req.params.id})
        console.log(`Share with .... List  ${req.body} :::: ${JSON.stringify(listObject)}` );
        const userId = req.body.sharedEmail;
        // add user to shopping list items array
        if(!listObject.sharedWith.includes(userId))
        {
            listObject.sharedWith.push(userId);
            console.log(`Share list Updated : ${listObject.sharedWith}`);
            listObject = await ShoppingList.findOneAndUpdate({"_id":req.params.id},{"sharedWith": listObject.sharedWith}).populate(["listItems","sharedWith"]);
        }

        res.send(retrunResponse(200, listObject,""));
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse( error.code, null, error.name));
    }
    
}

async function getListItemByName(req,res){
    try{
        console.log(`get list item banana object ::::: = ${req.params.id} :: ${req.params.itemId}}`);
        
        const filter = {"list_id": req.params.id,"product_id":req.params.itemId};
        let item = await ListItem.findOne(filter).populate(["product_id","product_id.measures","list_id","measure_id"]);
        res.send(retrunResponse(200, item, ""));
    }catch (error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    } 
}

