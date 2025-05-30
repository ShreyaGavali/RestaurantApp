import Table from "../models/Table.js";

// Get all tables
export const getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({ message: "Server error while fetching tables" });
  }
};

export const getAvailableTables = async (req, res) => {
  try {
    const tables = await Table.find({ status: "Available" });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET only reserved tables
export const getReservedTables = async (req, res) => {
  try {
    const tables = await Table.find({ status: "Reserved" });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new table
export const addTable = async (req, res) => {
  try {
    const { name, chairs } = req.body;
    if (!name || !chairs) return res.status(400).json({ message: "Name and chairs are required" });

    const newTable = new Table({ name, chairs, status: "Available" });
    await newTable.save();
    res.status(201).json(newTable);
  } catch (err) {
    console.error("Error adding table:", err);
    res.status(500).json({ message: "Server error while adding table" });
  }
};

// Update a table
export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, chairs, status } = req.body;

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { name, chairs, status },
      { new: true }
    );
    if (!updatedTable) return res.status(404).json({ message: "Table not found" });

    res.json(updatedTable);
  } catch (err) {
    console.error("Error updating table:", err);
    res.status(500).json({ message: "Server error while updating table" });
  }
};

// Delete a table
export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTable = await Table.findByIdAndDelete(id);
    if (!deletedTable) return res.status(404).json({ message: "Table not found" });

    res.json({ message: "Table deleted successfully" });
  } catch (err) {
    console.error("Error deleting table:", err);
    res.status(500).json({ message: "Server error while deleting table" });
  }
};
