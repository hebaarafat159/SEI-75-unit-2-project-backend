import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name:{type: String, required: true},
    image:{type: String, required: true},
    parent_cat: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'categories'
    },
    isSubCategory: {type: Boolean,default : false}
});

export default mongoose.model('categories', categorySchema);
