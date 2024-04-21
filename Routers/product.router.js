const express = require("express");
const { Product } = require("../Models/product.model");
const productRouter = express.Router();

// Create Product Endpoint
productRouter.post("/", async (req, res) => {
  const { title, description, price, categoryId, image, ownerId } = req.body;
  try {
    // Create new product

    const newProduct = new Product({
      title,
      description,
      price,
      category: categoryId,
      image,
      owner: ownerId,
    });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Product Endpoint
productRouter.put("/:productId", async (req, res) => {
  const { productId } = req.params;
  const { title, description, price, categoryId, image } = req.body;
  try {
    // Find product by ID
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields
    if (title) {
      product.title = title;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    if (category) {
      product.category = categoryId;
    }
    if (image) {
      product.image = image;
    }

    // Save updated product
    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Read Single Product Endpoint
productRouter.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    // Find product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Product Endpoint
productRouter.delete("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    // Find product by ID and delete
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Delete product image (if needed)
    // DeleteImageFunction(product.image);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Read Products Endpoint with Filtering and Sorting
productRouter.get("/", async (req, res) => {
  const { userId } = req.body;
  try {
    let query = { owner: userId };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by title (case insensitive)
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" };
    }

    // Sort by price (ascending or descending)
    let sortOptions = {};
    if (req.query.sortBy === "price") {
      sortOptions.price = req.query.sortOrder === "desc" ? -1 : 1;
    }

    // Retrieve products with filtering and sorting
    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  productRouter,
};
