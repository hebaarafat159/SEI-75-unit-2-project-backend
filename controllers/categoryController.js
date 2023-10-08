import 'dotenv/config'
import mongoose from "mongoose";
import Category from '../models/categoryModel.js';
import productController from '../controllers/productController.js'

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getCategories,
    getCategoryById,
    getContent
}

/**
 * get all categories from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getCategories(req,res){
    const filter = {};
    let categories = await Category.find(filter)
    return res.json(categories);
}

async function getCategoryObject(catId){
    const filter = {_id: `${catId}`};
    let category = await Category.findOne(filter)
    return category;
}

/**
 * get a category object from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getCategoryById(req,res){
     res.json(await getCategoryObject(req.params.id));
}

/**
 * called when the user select a category.
 * if it has subcategory, then it will return the subcategory list.
 * else it will return product list for that category. 
 * @param {*} req 
 * @param {*} res 
 */
async function getContent(req,res){
    const category_id = req.params.id;
    const categoryObject = await getCategoryObject(category_id);

    // console.log(`${categoryObject} \n \n Get Conetnt ........ ${categoryObject._id} \n parent_cat: ${categoryObject.parent_cat} `);
    
    // case of it contain a subcategory
    if(!(categoryObject._id.equals(categoryObject.parent_cat))){
        const filter = {"parent_cat": `${category_id}`};
        let categories = await Category.find(filter);
        console.log(`Sub Category : ${JSON.stringify(categories)}`);
        return res.json(categories);
    }// case of load category's products list
    else{
        console.log(`Get Conetnt Products ........`);
        return  productController.getProductsOfCategory(req,res);
    }
    
   
}

// // get a book details
// async function getBookById(req,res){
//     // console.log(`Book Id : ` + req.params.id);
//     const filter = {_id: `${req.params.id}`};
//     // console.log(`A Book`);
//     let book = await Book.findOne(filter)
//     // console.log(JSON.stringify(book));
//     return res.json(book);
// }

// async function saveBook(req, res){
//     // TODO fix this issue
//     // expected id '651b32ad56a4c7ac494212b5'
//     let authorObj = await authorsController.getAuthorByName(req.body.authorName)
//     if(authorObj === null) 
//     {
//         authorObj = authorsController.saveAuthor(req.body.authorName)
//     }

//     if(authorObj !== null)
//     {
//         // console.log(`authorObj id for book = ${authorObj._id}`)
        
//         //{"title":"the secret","description":"ihdeiudheidbe","publishedDate":"04/10/2023","authorName":"JAke"}
//         const newBook = new Book({
//             title: req.body.title,
//             description: req.body.description,
//             publishedDate: req.body.publishedDate,
//             author: authorObj._id
//         })

//         console.log(`new book Object = ${JSON.stringify(newBook)}`)
        
//         await newBook.save()
//         .then((newBook) => {
//             res.sendStatus(200);
//             console.log(JSON.stringify(newBook));
//         })
//         .catch((error) => {
//             console.log(error);
//             res.sendStatus(500);
//         });
//     }
// }

// // delete book from database
// async function deleteBook(req, res){
//     console.log(`Book Id : ` + req.params.id);
//     const filter = {"_id": `${req.params.id}`};
//     console.log(`A Book`);
//     Book.deleteOne(filter).then(()=>{
//         console.log('Delete Book')
//         res.sendStatus(200);
//     }).catch((error) => {
//         console.log('Delete Book Error')
//         console.log(error);
//         res.sendStatus(500);
//     });
// }

// // update an existing  book  title and published date
// async function updateBook(req, res){
//     console.log(`Book Id : ` + req.params.id);
//     const filter = {_id: `${req.params.id}`};
//     console.log(`A Book`);

//     Book.updateOne(filter, {
//         title: req.body.title,
//         publishedDate: req.body.publishedDate
//     }).then(()=>{
//         console.log('Update Book')
//         res.sendStatus(200);
//     }).catch((error) => {
//         console.log('Update Book Error')
//         console.log(error);
//         res.sendStatus(500);
//     });
// }


