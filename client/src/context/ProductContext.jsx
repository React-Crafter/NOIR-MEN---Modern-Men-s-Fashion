import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getProducts();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data);
        setError(null);
      }
    } catch (err) {
      console.warn('API getProducts fallback to local data:', err.message);
      // Fallback to initial products if backend is booting
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductById = useCallback((id) => {
    if (!id) return null;
    return products.find(p => p.id === id || p.customId === id || p._id === id);
  }, [products]);

  const createProduct = async (productData) => {
    const res = await api.createProduct(productData);
    if (res.success && res.data) {
      setProducts(prev => [res.data, ...prev]);
    }
    return res;
  };

  const updateProduct = async (id, productData) => {
    const res = await api.updateProduct(id, productData);
    if (res.success && res.data) {
      setProducts(prev =>
        prev.map(p => (p.id === id || p.customId === id || p._id === id ? res.data : p))
      );
    }
    return res;
  };

  const deleteProduct = async (id) => {
    const res = await api.deleteProduct(id);
    if (res.success) {
      setProducts(prev =>
        prev.filter(p => p.id !== id && p.customId !== id && p._id !== id)
      );
    }
    return res;
  };

  const value = {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
