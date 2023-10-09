import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const listItemSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    quantity:{type: Number, required: true, default:1},
    measure_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Measurement'
    },
    lastUpdatedDate: {
        type: Number,
        default: function(){
            return new Date().getTime();
        }
    },
    hasBrought:{
        type: Boolean,
        require: true,
        default: false
    },
    list_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ShoppingList'
    },
},{
    timestamp: true
});

export default mongoose.model('listItem', listItemSchema);
