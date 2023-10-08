import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const measureSchema = new Schema({
    name:{type: String, required: true},
    prefix_str:{type: String, required: true}
});

export default mongoose.model('measurements', measureSchema);
