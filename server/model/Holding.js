import mongoose from "mongoose";

const HoldingSchema = new mongoose.Schema({
    userId: {type:String},
    coinId: {type:String, required:true},
    symbol: {type:String, required:true},
    amount: {type:Number, required:true},
    buyPrice: {type:Number, required:true}
});

export default mongoose.model("Holding", HoldingSchema);
