const express = require("express");
const CartModel = require("../product_model/cart.model");
const ProductModel = require("../product_model/product.model");
const cartRouter = express.Router();

// Add item to cart
cartRouter.post("/add", async (req, res) => {
  const {  productId, quantity } = req.body;
  const userId = req.user._id

  if (!userId || !productId || !quantity) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const cartItem = new CartModel({ userId, productId, quantity });
    await cartItem.save();
    res.status(201).send({ message: "Product added to cart", cartItem });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

// Get cart items for a user
cartRouter.get("/", async (req, res) => {
  const userId = req.user._id

  try {
    const cartItems = await CartModel.find({ userId }).populate("productId");
    res.status(200).send({ data: cartItems });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

// Update cart item quantity
cartRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).send({ message: "Valid quantity is required" });
  }

  try {
    const updatedCartItem = await CartModel.findByIdAndUpdate(id, { quantity }, { new: true });
    if (!updatedCartItem) {
      return res.status(404).send({ message: "Cart item not found" });
    }

    res.status(200).send({ message: "Cart item updated", cartItem: updatedCartItem });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

// Remove item from cart
cartRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCartItem = await CartModel.findByIdAndDelete(id);
    if (!deletedCartItem) {
      return res.status(404).send({ message: "Cart item not found" });
    }

    res.status(200).send({ message: "Cart item removed" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

module.exports = cartRouter;
