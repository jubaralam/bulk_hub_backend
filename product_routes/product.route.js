const express = require("express");
const productRouter = express.Router();
const ProductModel = require("../product_model/product.model");
const authMiddleware = require("../middleware/auth.middleware")

const rolesForCreation = ["seller", "admin"]

// Create a new product
productRouter.post("/create", authMiddleware, async (req, res) => {
  const { title, price, weight, description, category } = req.body;
const {role}= req.user

if(!role.includes("seller") || !role.includes("admin")){
  return res.send({"message":"you are not authorized"})
}
  // Validate input fields
  if (!title || !price || !weight || !description || !category) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const newProduct = new ProductModel({
      title,
      price,
      weight,
      description,
      category,
    });

    await newProduct.save();
    res.status(201).send({ message: "New product has been added", product: newProduct });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

// Get all products
productRouter.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).send({ data: products });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

// Update a product
productRouter.put("/update/:id",authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const {role}= req.user

if(!role.includes("seller") || !role.includes("admin")){
  return res.send({"message":"you are not authorized"})
}

  // Ensure at least one field is provided for update
  if (!Object.keys(updates).length) {
    return res.status(400).send({ message: "At least one field is required for update" });
  }

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
    });

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({ message: "Product has been updated", product: updatedProduct });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

// Delete a product
productRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const {role}= req.user

if(!role.includes("seller") || !role.includes("admin")){
  return res.send({"message":"you are not authorized"})
}
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({ message: "Product has been deleted" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

module.exports = productRouter;
