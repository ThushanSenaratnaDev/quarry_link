import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    orderedStock: { type: Number, default: 0 }, // Ordered stock (not yet available)
    availableStock: { type: Number, default: 0 }, // Stock ready for purchase
  },
  { timestamps: true }
);

// Virtual field for total stock (ordered + available)
InventorySchema.virtual("totalStock").get(function () {
  return this.orderedStock + this.availableStock;
});

// Export the model
const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
