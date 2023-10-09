import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const listItemSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    quantity:{type: Number, required: true, default:1},
    measure:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Measurement'
    },
    lastUpdatedDate: {
        type: Date,
        default: function(){
            return new Date();
        }
    },
    hasBrought:{
        type: Boolean,
        require: true,
        default: false
    }
},{
    timestamp: true
});

export default mongoose.model('listItem', listItemSchema);
