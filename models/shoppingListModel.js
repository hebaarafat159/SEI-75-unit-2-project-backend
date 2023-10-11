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
        type: Number,
        default: function(){
            return new Date().getTime();
        }
    },
    sharedWith:[
        {
            type: String
        }
    ],
    isSelected:{type: Boolean, required: true}
});

export default mongoose.model('ShoppingLists', shoppingListSchema);
