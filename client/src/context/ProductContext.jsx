import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProducts, checkServerHealth } from '../services/api.js';
import { INITIAL_PRODUCTS } from '../data/products.js';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [serverStatus, setServerStatus] = useState({ mongodb: 'checking' });

  // Admin state
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('noir_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('noir_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('noir_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [cart]);

  // Load products on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchProducts();
        if (mounted && data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.warn('Error loading products:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    async function checkHealth() {
      try {
        const health = await checkServerHealth();
        if (mounted) setServerStatus(health);
      } catch {
        if (mounted) setServerStatus({ mongodb: 'disconnected' });
      }
    }

    loadData();
    checkHealth();

    return () => { mounted = false; };
  }, []);

  // Toast notifier
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Actions
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'Free Size';
    const color = selectedColor || (product.colors && product.colors[0]?.name) || 'Standard';
    const itemKey = `${product._id || product.customId}-${size}-${color}`;

    setCart(prev => {
      const existing = prev.find(item => item.key === itemKey);
      if (existing) {
        return prev.map(item =>
          item.key === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          key: itemKey,
          productId: product._id || product.customId,
          customId: product.customId,
          name: product.name,
          category: product.category,
          price: product.price,
          previousPrice: product.previousPrice,
          image: product.images?.[0] || '/assets/images/hero_noir_men_1790217929182.jpg',
          size,
          color,
          quantity
        }
      ];
    });

    addToast(`Added "${product.name}" (${size}) to your bag`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemKey, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.key === itemKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (itemKey) => {
    setCart(prev => prev.filter(item => item.key !== itemKey));
    addToast('Item removed from bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Admin auth
  const setAdminSession = (user) => {
    setAdminUser(user);
    if (user) {
      localStorage.setItem('noir_admin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('noir_admin_user');
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('noir_admin_user');
    addToast('Logged out of Admin Portal', 'info');
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        loading,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toasts,
        addToast,
        removeToast,
        serverStatus,
        adminUser,
        setAdminSession,
        logoutAdmin
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

export default ProductContext;
