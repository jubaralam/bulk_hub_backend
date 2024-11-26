const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true }, // Total price of the order
    orderStatus: { type: String, default: "Pending", enum: ["Pending", "Shipped", "Delivered", "Cancelled"] }, // Status of the order
    orderedAt: { type: Date, default: Date.now }, // Timestamp of order placement
    deliveredAt: { type: Date }, // Timestamp of order delivery
  });
  
  const OrderModel = mongoose.model("order", orderSchema);
  
  module.exports = OrderModel;
  