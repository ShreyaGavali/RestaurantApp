import Chef from "../models/Chef.js";

// Chef count
export const getChefCount = async (req, res) => {
  try {
    const totalChefs = await Chef.countDocuments();
    res.status(200).json({ totalChefs });
  } catch (error) {
    res.status(500).json({ message: "Failed to count chefs", error });
  }
};

// Get all chefs
export const getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (err) {
    console.error("Error fetching chefs:", err);
    res.status(500).json({ message: "Server error while fetching chefs" });
  }
};

// Add a new chef
export const addChef = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Chef name is required" });

    const newChef = new Chef({ name, ordersTaken: 0 });
    await newChef.save();
    res.status(201).json(newChef);
  } catch (err) {
    console.error("Error adding chef:", err);
    res.status(500).json({ message: "Server error while adding chef" });
  }
};

// Update chef details
export const updateChef = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const chef = await Chef.findByIdAndUpdate(id, { name }, { new: true });
    if (!chef) return res.status(404).json({ message: "Chef not found" });

    res.json(chef);
  } catch (err) {
    console.error("Error updating chef:", err);
    res.status(500).json({ message: "Server error while updating chef" });
  }
};

// Delete a chef
export const deleteChef = async (req, res) => {
  try {
    const { id } = req.params;
    const chef = await Chef.findByIdAndDelete(id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });

    res.json({ message: "Chef deleted successfully" });
  } catch (err) {
    console.error("Error deleting chef:", err);
    res.status(500).json({ message: "Server error while deleting chef" });
  }
};
