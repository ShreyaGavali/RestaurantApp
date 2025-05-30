import mongoose from "mongoose";

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true},
  ordersTaken: { type: Number, default: 0 }
});

export default mongoose.model("Chef", chefSchema);
