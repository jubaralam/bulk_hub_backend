const express = require("express");
const PaymentModel = require("../product_model/payment.model");
const paymentRouter = express.Router();

// Make a payment
paymentRouter.post("/pay", async (req, res) => {
  const { orderId, paymentMethod, amount } = req.body;
  const userId = req.user._id

  if (!orderId || !userId || !paymentMethod || !amount) {
    return res.status(400).send({ message: "All fields are required" });
  }

  
  try {
    const newPayment = new PaymentModel({
      orderId,
      userId,
      paymentMethod,
      amount,
      paymentStatus: "Completed",
      paidAt: new Date(),
    });

    await newPayment.save();
    res.status(201).send({ message: "Payment successful", payment: newPayment });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

// Get payment details for a user
paymentRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const id = req.user._id
  console.log(id)

  try {
    const payments = await PaymentModel.find({ userId }).populate("orderId");
    res.status(200).send({ data: payments });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

module.exports = paymentRouter;
