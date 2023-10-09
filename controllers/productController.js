import 'dotenv/config'
import mongoose from "mongoose";
import Product from '../models/productModel.js';
import Measurement from '../models/measurementModel.js'

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getProducts,
    getProductsOfCategory,
    getProductById,


    getAllMeasures,
    getMeasurementById,
    getProductMeasures
}

/**  Products Queries */

/**
 * return all products from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getProducts(req,res){
    const filter = {};
    let products = await Product.find(filter)
    return res.json(products);
}

async function getProductById(req,res){
    return (await res.json(getProductObject(req.params.id)))
}

/**
 * return a specific product from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getProductObject(productId){
    const filter = {"_id": productId};
    let product = await Product.findOne(filter)
    return product;
}

/**
 * return all products for a category
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getProductsOfCategory(req,res){
    const filter = {"category_id": `${req.params.id}`};
    let products = await Product.find(filter)
    return res.json(products);
}

/**  Measurements Queries */

/**
 * return all measeremnets from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getAllMeasures(req,res){
    const filter = {};
    let measures = await Measurement.find(filter)
    return res.json(measures);
}

/**
 * return a specific measurement object from database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getMeasurementById(req,res){
    const filter = {"_id": `${req.params.id}`};
    let measure = await Measurement.findOne(filter)
    return res.json(measure);
}

/**
 * return a product mearement list from database
 * @param {*} req 
 * @param {*} res 
 */
async function getProductMeasures(req, res){
 
    const productObj = await getProductObject(req.params.productId);
    console.log(`selected object : ${JSON.stringify(productObj)}`);
    const list = productObj.measures;
    console.log(`measures : ${list}`);

    if(list!==undefined && list.length > 0){
        const filter = {"_id": {$in: list}};
        let measure = await Measurement.find(filter);
        console.log(`measure object : ${JSON.stringify(measure)}`);
        return res.json(measure);
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


