import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true},
  chairs: { type: Number, required: true},
  tableStatus: { type: String, enum: ["Available", "Reserved"], default: "Available" }
});

export default mongoose.model("Table", tableSchema);
