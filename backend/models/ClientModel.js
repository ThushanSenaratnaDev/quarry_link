import mongoose from "mongoose";

const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    }
});

const ClientModel = mongoose.model("ClientModel", clientSchema);

export default ClientModel;
