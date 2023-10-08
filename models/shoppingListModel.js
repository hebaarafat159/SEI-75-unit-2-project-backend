import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const shoppingListSchema = new Schema({
    name:{type: String, required: true},
    listItems:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'ListItem'
        }
    ],
    lastUpdatedDate: {
        type: Date,
        default: function(){
            return new Date();
        }
    },
    sharedWith:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        }
    ],
});

export default mongoose.model('shoppingLists', shoppingListSchema);
