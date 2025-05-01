import OrderModel from "../models/OrderModel.js";

// Data Display
const getAllOrders = async (req, res, next) => {
    let Orders;

    try {
        Orders = await OrderModel.find();
    } catch (err) {
        console.log(err);
    }

    if (!Orders) {
        return res.status(404).json({ message: "Order Not Found!" });
    }

    return res.status(200).json({ Orders });
};

//Data Insert
const addOrders = async (req, res, next) => {

    const {orderNo,orderDate,deliveryAddress,deliveryDate,status,totalPrice} = req.body;

    let Orders;

    try{
        Orders = new Order({orderNo,orderDate,deliveryAddress,deliveryDate,status,totalPrice});
        await Orders.save();
    }catch (err) {
        console.log(err);
    }
    //If not insert Orders
    if(!Orders){
        return res.status(404).send({message:"Unable to add Orders"});
    }
    return res.status(200).json({ Orders
    });

}

//Get by Id
const getById = async (req, res, next) => {

    const id = req.params.id;

    let Orders;

    try{
        Orders = await Order.findById(id);
    }catch (err){
        console.log(err);
    }
    //Not available Orders
    if(!Orders){
        return res.status(404).send({message:"Order not found!"});
    }
    return res.status(200).json({ Orders
    });
}

//Update Order Details
const updateOrder = async(req, res, next) => {

    const id = req.params.id;
    const {orderNo,orderDate,deliveryAddress,deliveryDate,status,totalPrice} = req.body;

    let Orders;

    try{
        Orders = await Order.findByIdAndUpdate(id,
            {orderNo:orderno, orderDate:orderdate, deliveryAddress:deliveryaddress, deliveryDate:deliverydate, status:status, totalPrice:totalprice});
            Orders = await Order.save();
    }catch(err) {
        console.log(err);
    }
    if(!Orders){
        return res.status(404).json({message:"Unable to Update Order Details!"});
    }
    return res.status(200).json({ Orders});

}

//Delete Order Details

const deleteOrder = async(req, res, next) => {

    const id = req.params.id;

    let Orders;

    try{
        Orders = await Order.findByIdAndDelete(id)
    }catch(err) {
        console.log(err);
    }
    if(!Orders){
        return res.status(404).json({message:"Unable to Delete Order Details!"});
    }
    return res.status(200).json({Orders});

};

export default {
    getAllOrders,
    addOrders,
    getById,
    updateOrder,
    deleteOrder
};
