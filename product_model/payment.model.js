const mongoose = require("mongoose")

const paymentSchema = mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true }, // Reference to the order
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    paymentMethod: { type: String, required: true, enum: ["Credit Card", "Debit Card", "PayPal", "UPI", "Cash On Delivery"] }, // Payment method
    paymentStatus: { type: String, default: "Pending", enum: ["Pending", "Completed", "Failed"] }, // Status of the payment
    transactionId: { type: String }, // Transaction ID for tracking payments
    paidAt: { type: Date }, // Timestamp of payment
    amount: { type: Number, required: true }, // Total amount paid
  });
  
  const PaymentModel = mongoose.model("payment", paymentSchema);
  
  module.exports = PaymentModel;
  