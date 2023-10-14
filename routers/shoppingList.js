import 'dotenv/config'
import express from "express";
import shoppingListController from '../controllers/shoppingListController.js'

let listRouter = express.Router();


/**  shopping lists routes  */


/**
 * retern all lists
 */
listRouter.get('/',async (req,res)=>{
    shoppingListController.getAllShoppingList(req,res);
})

/**
 * return shopping lists for a user
 */
listRouter.get('/:userId',async (req,res)=>{
    shoppingListController.getUserShoppingList(req,res);
})

/**
 * save new shopping list
 */
listRouter.post('add/:id',async (req,res)=>{
    console.log(`add Shopping List = ${JSON.stringify(req.params.id)}`)
    shoppingListController.addShoppingList(req,res);
})



/**  items in a lists routes  */

/**
 * get all items in a list
 */
listRouter.get('/:id/listItems',async (req,res)=>{ 
    shoppingListController.getShoppingListItems(req, res);
});


/**
 * add list item to specific shopping list
 */
listRouter.post('/:id/listItems/add',async (req,res)=>{ 
    console.log(`add List Item = ${JSON.stringify(req.params.id)}`)
    shoppingListController.addProductToShoppingList(req, res);
});

/**
 * detelet item from a list
 */
listRouter.delete('/:id/listItems/delete',async (req,res)=>{ 
    console.log(`delete List Item = ${JSON.stringify(req.params.id)}`)
    shoppingListController.deleteProductFromShoppingList(req, res);
});

/**
 * detelet item from a list
 * */
listRouter.put('/:id/listItems/updateStatus',async (req,res)=>{ 
    shoppingListController.updateListItemStatus(req, res);
});

listRouter.get('/:id/count',async (req,res)=>{ 
    shoppingListController.getShoppingListItemsCount(req, res);
});

/**
 * add list item to specific shopping list
 */
listRouter.put('/:id/share',async (req,res)=>{ 
    shoppingListController.updateShoppingListUsers(req, res);
});

/**
 * get an items in a list
 */
listRouter.get('/:id/listItems/:itemId',async (req,res)=>{ 
    shoppingListController.getListItemByName(req, res);
});


export default listRouter;
