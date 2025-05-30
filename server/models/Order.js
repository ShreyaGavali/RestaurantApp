import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderType: { type: String, enum: ["Dine In", "Take Away"] },
  status: { type: String, enum: ["Processing", "Done", "Served", "Not Picked Up"], default: "Processing" },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: false },
  items: [{ name: String, price: Number, quantity: Number }],
  itemCount: {type: Number},
  timestamp: { type: Date, default: Date.now },
  instructions: { type: String },
  assignedChef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" },
  customerName: { type: String},
  customerPhone: { type: String},
  customerAddress: { type: String}, 

  estimatedDeliveryTime: { type: String } 
});

export default mongoose.model("Order", orderSchema);
