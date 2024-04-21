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
    // Parse query parameters
    const { category, title, sortBy, sortOrder, page, limit } = req.query;

    // Build filter object
    const filter = {owner:userId};
    if (category) {
      filter.category = category;
    }
    if (title) {
      // Case-insensitive search
      filter.title = { $regex: title, $options: 'i' };
    }

    // Build sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 8;
    const skip = (pageNumber - 1) * pageSize;

    // Query products with filter, sort, pagination, and limit
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // Total count of products (for pagination)
    const totalCount = await Product.countDocuments(filter);

    res.json({
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: pageNumber,
      pageSize,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = {
  productRouter,
};
