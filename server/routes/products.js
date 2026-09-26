import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = Router();

// GET /api/products - list all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured, isNew } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.$or = [
        { categorySlug: category.toLowerCase() },
        { category: new RegExp(`^${category}$`, 'i') }
      ];
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { fabric: regex },
        { category: regex }
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && !isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (isNew === 'true') {
      query.isNew = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc' || sort === 'price_low_high') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc' || sort === 'price_high_low') {
      sortOption = { price: -1 };
    } else if (sort === 'newest') {
      sortOption = { isNew: -1, createdAt: -1 };
    } else if (sort === 'popular') {
      sortOption = { isPopular: -1, createdAt: -1 };
    } else if (sort === 'featured') {
      sortOption = { isFeatured: -1, createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOption);
    return res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching products', error: error.message });
  }
});

// GET /api/products/:id - get single product by customId or Mongo _id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findOne({ customId: id });

    if (!product && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// POST /api/products - create new product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      previousPrice,
      discount,
      images,
      colors,
      sizes,
      stock,
      description,
      fabric,
      fit,
      careInstructions,
      isNew,
      isFeatured,
      isPopular
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required fields'
      });
    }

    // Auto-generate categorySlug
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

    // Auto-generate customId
    const catCode = categorySlug.slice(0, 2);
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const customId = `nm-${catCode}-${randomCode}`;

    // Normalize images: ensure at least one image or fallback
    let normalizedImages = Array.isArray(images) && images.length > 0 ? images.filter(Boolean) : [];
    if (normalizedImages.length === 0) {
      normalizedImages = ['/assets/images/category_panjabi_1790217944904.jpg'];
    }

    // Normalize colors
    let normalizedColors = Array.isArray(colors) && colors.length > 0 ? colors : [{ name: 'Black', hex: '#111111' }];

    // Normalize sizes
    let normalizedSizes = Array.isArray(sizes) && sizes.length > 0 ? sizes : ['M', 'L', 'XL'];

    const newProduct = new Product({
      customId,
      name: name.trim(),
      category: category.trim(),
      categorySlug,
      price: Number(price),
      previousPrice: previousPrice ? Number(previousPrice) : 0,
      discount: discount ? Number(discount) : 0,
      images: normalizedImages,
      colors: normalizedColors,
      sizes: normalizedSizes,
      stock: stock !== undefined ? Number(stock) : 10,
      description: description || '',
      fabric: fabric || '',
      fit: fit || '',
      careInstructions: careInstructions || '',
      isNew: Boolean(isNew),
      isFeatured: Boolean(isFeatured),
      isPopular: Boolean(isPopular)
    });

    const saved = await newProduct.save();
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: saved
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
});

// PUT /api/products/:id - update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findOne({ customId: id });

    if (!product && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = req.body;
    if (updates.category && !updates.categorySlug) {
      updates.categorySlug = updates.category.toLowerCase().replace(/\s+/g, '-');
    }

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.previousPrice !== undefined) updates.previousPrice = Number(updates.previousPrice);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    Object.assign(product, updates);
    const updated = await product.save();

    return res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
});

// DELETE /api/products/:id - delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = await Product.findOneAndDelete({ customId: id });

    if (!deleted && mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Product.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: deleted.customId || deleted._id }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
});

export default router;
