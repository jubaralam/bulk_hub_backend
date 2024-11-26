

const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true }, 
  quantity: { type: Number, required: true, min: 1 }, 
  addedAt: { type: Date, default: Date.now }, // Timestamp when the product was added to the cart
});

const CartModel = mongoose.model("cart", cartSchema);

module.exports = CartModel;
