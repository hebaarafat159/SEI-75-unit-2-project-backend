import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name:{type: String, required: true},
    image:{type: String, required: true},
    parent_cat: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
});

export default mongoose.model('categories', categorySchema);
