import MenuItem from "../models/MenuItem.js";

// Get all menu items
export const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ message: "Server error while fetching menu items" });
  }
};

export const getFilteredMenuItems = async (req, res) => {
  try {
    const { category } = req.body;

    const filter = category ? { category } : {};

    const items = await MenuItem.find(filter);
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Add a new menu item
export const addMenuItem = async (req, res) => {
  try {
    const { name, price, category, img } = req.body;
    if (!name || !price || !category || !img) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    const newItem = new MenuItem({ name, price, category, img });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error adding menu item:", err);
    res.status(500).json({ message: "Server error while adding menu item" });
  }
};

// Update a menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;

    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, price, category },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: "Menu item not found" });

    res.json(updatedItem);
  } catch (err) {
    console.error("Error updating menu item:", err);
    res.status(500).json({ message: "Server error while updating menu item" });
  }
};

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ message: "Menu item not found" });

    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).json({ message: "Server error while deleting menu item" });
  }
};
