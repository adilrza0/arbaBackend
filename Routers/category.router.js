const express = require('express');
const { Category } = require('../Models/category.model');
const categoryRouter = express.Router();


// Create Category Endpoint
categoryRouter.post('/', async (req, res) => {
  const { name, slug, image, ownerId } = req.body;
  try {
    const newCategory = new Category({ name, slug, image, owner: ownerId });
    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Category Endpoint
categoryRouter.put('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { name, slug, image } = req.body;
  try {
    let category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    // Update category fields
    category.name = name;
    category.slug = slug;
    category.image = image;
    await category.save();
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Read Categories Endpoint
categoryRouter.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Read Single Category Endpoint
categoryRouter.get('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete Category Endpoint
categoryRouter.delete('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    // Delete category image (if needed)
    // DeleteImageFunction(category.image);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = categoryRouter;
