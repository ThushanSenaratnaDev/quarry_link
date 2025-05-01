import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNo: {
        type: String,
        required: true,
    },
    orderDate: {
        type: Number,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    deliveryDate: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    }
});

const OrderModel = mongoose.model("OrderModel", orderSchema);

export default OrderModel;
