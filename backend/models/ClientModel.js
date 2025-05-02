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
    },
});

// Renamed the model name to "Client" (standard)
const ClientModel = mongoose.model("Client", clientSchema);

export default ClientModel;
