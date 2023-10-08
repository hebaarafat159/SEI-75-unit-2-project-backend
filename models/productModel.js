import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name:{type: String, required: true},
    description:{type: String},
    image:{type: String, required: true},
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    measures:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Measurement'
        }
    ]
});

export default mongoose.model('products', productSchema);
