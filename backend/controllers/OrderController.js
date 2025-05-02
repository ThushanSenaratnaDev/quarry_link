import OrderModel from "../models/OrderModel.js";

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const Orders = await OrderModel.find();
        return res.status(200).json({ Orders });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error retrieving orders" });
    }
};

// Add a new order
const addOrders = async (req, res) => {
    const { orderNo, orderDate, deliveryAddress, deliveryDate, status, totalPrice, products } = req.body;

    try {
        const Orders = new OrderModel({ 
            orderNo, 
            orderDate, 
            deliveryAddress, 
            deliveryDate, 
            status, 
            totalPrice,
            products 
        });
        await Orders.save();
        return res.status(201).json({ Orders });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Unable to add order" });
    }
};

// Get order by ID
const getById = async (req, res) => {
    const id = req.params.id;

    try {
        const Orders = await OrderModel.findById(id);
        if (!Orders) return res.status(404).json({ message: "Order not found" });
        return res.status(200).json({ Orders });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching order" });
    }
};

// Update order
const updateOrder = async (req, res) => {
    const id = req.params.id;
    const { orderNo, orderDate, deliveryAddress, deliveryDate, status, totalPrice, products } = req.body;

    try {
        const Orders = await OrderModel.findByIdAndUpdate(
            id,
            { orderNo, orderDate, deliveryAddress, deliveryDate, status, totalPrice, products },
            { new: true }
        );
        if (!Orders) return res.status(404).json({ message: "Unable to update order" });
        return res.status(200).json({ Orders });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Update failed" });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    const id = req.params.id;

    try {
        const Orders = await OrderModel.findByIdAndDelete(id);
        if (!Orders) return res.status(404).json({ message: "Unable to delete order" });
        return res.status(200).json({ Orders });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error deleting order" });
    }
};

export default {
    getAllOrders,
    addOrders,
    getById,
    updateOrder,
    deleteOrder,
};
