import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNo: {
        type: String,
        required: true,
    },
    orderDate: {
        type: String,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    deliveryDate: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    products: [{
        productType: String,
        quantity: Number,
        unitPrice: Number
    }]
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
