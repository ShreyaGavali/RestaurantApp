import Order from "../models/Order.js";
import Table from "../models/Table.js";
import Chef from "../models/Chef.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("tableId")
      .populate("assignedChef");
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};


export const addOrder = async (req, res) => {
  try {
    const {
      orderType,
      items,
      instructions,
      customerName,
      customerPhone,
      customerAddress,
      estimatedDeliveryTime
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }

    let table = null;

    if (orderType === "Dine In") {
      table = await Table.findOne({ tableStatus: "Available" });
      if (!table) {
        return res.status(400).json({ message: "No available tables" });
      }
      table.tableStatus = "Reserved";
      console.log(table.tableStatus);
      await table.save();
      console.log("table saved");
    }

    const chef = await Chef.findOne().sort({ ordersTaken: 1 });

    if (!chef) {
      return res.status(400).json({ message: "No chefs available" });
    }

    // Prepare the order data
    const orderData = {
      orderType,
      status: "Processing",
      tableId: table?._id || null,
      items,
      itemCount: items.length,
      instructions,
      assignedChef: chef._id
    };

    // Only add customer info for Take Away
    if (orderType === "Take Away") {
      orderData.customerName = customerName;
      orderData.customerPhone = customerPhone;
      orderData.customerAddress = customerAddress;
      orderData.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    const order = new Order(orderData);
    await order.save();

    // Increment chef's order count
    chef.ordersTaken += 1;
    await chef.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error while creating order" });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    // If order is complete, release table and reduce chef's load
    if (["Done", "Served", "Not Picked Up"].includes(status)) {
      if (order.assignedChef &&
        !["Done", "Served", "Not Picked Up"].includes(order.status)
      ) {
        await Chef.findByIdAndUpdate(order.assignedChef, { $inc: { ordersTaken: -1 } });
      }
    }

    res.json(order);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Server error while updating status" });
  }
};

export const assignChefToOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { chefId } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const chef = await Chef.findById(chefId);
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    order.assignedChef = chef._id;
    await order.save();

    chef.ordersTaken += 1;
    await chef.save();

    res.json(order);
  } catch (err) {
    console.error("Error assigning chef:", err);
    res.status(500).json({ message: "Server error while assigning chef" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If order had a table or chef, update their status
    if (order.tableId) {
      await Table.findByIdAndUpdate(order.tableId, { status: "Available" });
    }

    if (order.assignedChef) {
      await Chef.findByIdAndUpdate(order.assignedChef, { $inc: { ordersTaken: -1 } });
    }

    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Server error while deleting order" });
  }
};

export const getTotalRevenue = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] }
          }
        }
      }
    ]);

    const revenue = result[0]?.totalRevenue || 0;
    res.status(200).json({ totalRevenue: revenue });
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    res.status(500).json({ message: "Failed to calculate total revenue" });
  }
};

export const getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.status(200).json({ totalOrders });
  } catch (error) {
    console.error("Error getting total orders:", error);
    res.status(500).json({ message: "Failed to get total orders" });
  }
};

export const getTotalClients = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: "$customerPhone" // Group by unique phone numbers
        }
      },
      {
        $count: "totalClients" // Count the number of unique phone numbers
      }
    ]);

    const totalClients = result[0]?.totalClients || 0;
    res.status(200).json({ totalClients });
  } catch (error) {
    console.error("Error calculating total clients:", error);
    res.status(500).json({ message: "Failed to calculate total clients" });
  }
};

// export const getOrderStats = async (req, res) => {
//   try {
//     const dineInCount = await Order.countDocuments({ orderType: 'Dine In' });
//     const takeAwayCount = await Order.countDocuments({ orderType: 'Take Away' });
//     const servedCount = await Order.countDocuments({ status: 'Served' });

//     res.status(200).json({
//       dineIn: dineInCount,
//       takeAway: takeAwayCount,
//       served: servedCount
//     });
//   } catch (error) {
//     console.error('Error fetching order stats:', error);
//     res.status(500).json({ message: 'Server error fetching order stats' });
//   }
// };

// Utility to get start of the day


// Utility to get start of the day in Asia/Kolkata timezone
const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// const getStartOfWeek = () => {
//   const now = new Date();
//   const first = now.getDate() - now.getDay(); // Sunday
//   const start = new Date(now.setDate(first));
//   start.setHours(0, 0, 0, 0);
//   return start;
// };
const getStartOfWeek = () => {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const first = now.getDate() - now.getDay();
  now.setDate(first);
  now.setHours(0, 0, 0, 0);
  return now;
};


export const getRevenueData = async (req, res) => {
  try {
    const orders = await Order.find({});
    const today = getStartOfDay(new Date());
    const startOfWeek = getStartOfWeek();

    const dailyRevenue = {};
    const weeklyRevenue = {
      Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0,
    };

    for (let order of orders) {


      const orderDate = new Date(order.timestamp);
      const localDate = new Date(orderDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const orderDay = localDate.toLocaleString("en-US", { weekday: "short", timeZone: "Asia/Kolkata" });


      const orderTotal = order.items.reduce(
        (acc, item) => acc + (Number(item.price) * Number(item.quantity)),
        0
      );



      const dayKey = localDate.toISOString().split("T")[0];
      if (!dailyRevenue[dayKey]) dailyRevenue[dayKey] = 0;
      dailyRevenue[dayKey] += orderTotal;

      if (localDate >= startOfWeek) {
        weeklyRevenue[orderDay] += orderTotal;
      }
    }

    res.json({
      daily: dailyRevenue,
      weekly: weeklyRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch revenue data", error: err.message });
  }
};


const getStartOfDayForOrderStat = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getStartOfWeekForOrderStat = () => {
  const now = new Date();
  const day = now.getDay(); // Sunday = 0
  const diff = now.getDate() - day;
  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getOrderStats = async (req, res) => {
  try {
    const filter = req.query.filter || "daily"; // default is daily
    const dateThreshold = filter === "weekly" ? getStartOfWeekForOrderStat() : getStartOfDayForOrderStat();

    const orders = await Order.find({ timestamp: { $gte: dateThreshold } });

    let takeAway = 0;
    let served = 0;
    let dineIn = 0;

    for (let order of orders) {
      if (order.orderType === "Take Away") takeAway++;
      if (order.status === "Served") served++;
      if (order.orderType === "Dine In") dineIn++;
    }

    res.json({ takeAway, served, dineIn });
  } catch (err) {
    res.status(500).json({ message: "Error fetching order stats", error: err.message });
  }
};
