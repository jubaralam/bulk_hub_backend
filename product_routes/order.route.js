const express = require("express");
const OrderModel = require("../product_model/order.model");
const orderRouter = express.Router();

// Place a new order
orderRouter.post("/place", async (req, res) => {
  const { products, totalAmount } = req.body;
  const userId = req.user._id
  if (!userId || !products || !totalAmount) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const newOrder = new OrderModel({ userId, products, totalAmount });
    await newOrder.save();
    res.status(201).send({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

// Get orders for a user
orderRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await OrderModel.find({ userId }).populate("products.productId");
    res.status(200).send({ data: orders });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

// Update order status
orderRouter.put("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!orderStatus) {
    return res.status(400).send({ message: "Order status is required" });
  }

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(id, { orderStatus }, { new: true });
    if (!updatedOrder) {
      return res.status(404).send({ message: "Order not found" });
    }

    res.status(200).send({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

module.exports = orderRouter;
