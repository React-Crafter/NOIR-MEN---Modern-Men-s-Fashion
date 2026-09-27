import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'noir_men_cart_v1';
const ORDER_STORAGE_KEY = 'noir_men_latest_order';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryLocation, setDeliveryLocation] = useState('inside_dhaka'); // 'inside_dhaka' | 'outside_dhaka'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'info', id }
  const [recentOrder, setRecentOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(current => (current?.id === id ? null : current));
    }, 3200);
  };

  const dismissToast = () => setToast(null);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = (product, size, color, quantity = 1) => {
    if (!product) return;
    const selectedSize = size || (product.sizes && product.sizes[0]) || 'M';
    const selectedColor = color || (product.colors && product.colors[0]) || { name: 'Standard', hex: '#111111' };
    const cartItemId = `${product.id}__${selectedSize}__${selectedColor.name}`;

    setItems(currentItems => {
      const existingIndex = currentItems.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...currentItems,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            previousPrice: product.previousPrice,
            image: product.images[0],
            size: selectedSize,
            color: selectedColor,
            quantity: Math.max(1, quantity)
          }
        ];
      }
    });

    showToast(`Added to cart: ${product.name} (${selectedSize})`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setItems(current => current.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.min(newQty, 10) } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const saveOrder = (orderData) => {
    setRecentOrder(orderData);
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderData));
    } catch {
      // ignore
    }
    clearCart();
  };

  // Calculations
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Delivery: Inside Dhaka ৳80, Outside Dhaka ৳130
  // Free delivery threshold: ৳3,000 or more
  const freeDeliveryThreshold = 3000;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold && subtotal > 0;
  const deliveryCharge = items.length === 0 ? 0 : (isFreeDelivery ? 0 : (deliveryLocation === 'outside_dhaka' ? 130 : 80));
  const grandTotal = subtotal + deliveryCharge;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const value = {
    items,
    totalItems,
    subtotal,
    deliveryCharge,
    grandTotal,
    deliveryLocation,
    setDeliveryLocation,
    freeDeliveryThreshold,
    isFreeDelivery,
    amountNeededForFreeDelivery,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toast,
    showToast,
    dismissToast,
    recentOrder,
    saveOrder
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
