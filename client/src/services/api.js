import { FALLBACK_PRODUCTS } from '../data/fallbackProducts.js';

const LOCAL_STORAGE_PRODUCTS_KEY = 'noir_men_local_products';
const LOCAL_STORAGE_ORDERS_KEY = 'noir_men_local_orders';

// Helper to get local products
function getLocalProducts() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not read local products storage:', e);
  }
  return FALLBACK_PRODUCTS;
}

// Helper to save local products
function saveLocalProducts(products) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Could not write local products storage:', e);
  }
}

// Helper to get local orders
function getLocalOrders() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not read local orders storage:', e);
  }
  return [
    {
      orderId: 'NM-20260924-8142',
      customerName: 'Tanvir Ahmed',
      phone: '01711982341',
      email: 'tanvir.ahmed@gmail.com',
      district: 'Dhaka',
      area: 'Gulshan 2, Road 71',
      address: 'House 14, Apartment 4B, Road 71, Gulshan 2, Dhaka',
      notes: 'Please call before delivery.',
      products: [
        {
          id: 'nm-pj-01',
          name: 'The Onyx Signature Silk Panjabi',
          price: 3450,
          quantity: 1,
          size: 'L',
          color: { name: 'Onyx Black', hex: '#111111' },
          image: '/assets/images/category_panjabi_1790217944904.jpg'
        }
      ],
      totalQuantity: 1,
      subtotal: 3450,
      deliveryCharge: 0,
      total: 3450,
      paymentMethod: 'Cash on Delivery',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];
}

// Helper to save local orders
function saveLocalOrders(orders) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Could not write local orders storage:', e);
  }
}

// Check API Health
export async function checkApiHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Fetch all products with filter support
export async function fetchProducts(filters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
  if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
  if (filters.sort) queryParams.append('sort', filters.sort);
  if (filters.featured) queryParams.append('featured', 'true');
  if (filters.isNew) queryParams.append('isNew', 'true');

  try {
    const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const res = await fetch(url);
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn('Using client-side fallback products store:', err.message);
  }

  // Fallback filtering in client
  let list = [...getLocalProducts()];

  if (filters.category && filters.category !== 'all') {
    const cat = filters.category.toLowerCase();
    list = list.filter(p => p.categorySlug === cat || p.category.toLowerCase() === cat);
  }

  if (filters.search && filters.search.trim()) {
    const s = filters.search.trim().toLowerCase();
    list = list.filter(
      p =>
        p.name.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.fabric?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s)
    );
  }

  if (filters.minPrice !== undefined && filters.minPrice !== '') {
    list = list.filter(p => p.price >= Number(filters.minPrice));
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
    list = list.filter(p => p.price <= Number(filters.maxPrice));
  }

  if (filters.featured) {
    list = list.filter(p => p.isFeatured);
  }

  if (filters.isNew) {
    list = list.filter(p => p.isNew);
  }

  if (filters.sort === 'price_asc' || filters.sort === 'price_low_high') {
    list.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc' || filters.sort === 'price_high_low') {
    list.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'newest') {
    list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (filters.sort === 'popular') {
    list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
  }

  return list;
}

// Fetch single product by customId or _id
export async function fetchProductById(id) {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn('API error fetching product, using local fallback:', err.message);
  }

  const products = getLocalProducts();
  const found = products.find(p => p.customId === id || p._id === id);
  return found || null;
}

// Place order
export async function createOrder(orderPayload) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Also save to local storage for instant sync in offline/demo views
        const orders = getLocalOrders();
        orders.unshift(data.data);
        saveLocalOrders(orders);
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not post order to server, using local fallback store:', err.message);
  }

  // Fallback local order creation
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `NM-${dateStr}-${randomSuffix}`;

  const isInsideDhaka =
    orderPayload.district?.trim().toLowerCase() === 'dhaka' ||
    orderPayload.deliveryLocation === 'inside_dhaka';

  const subtotal = orderPayload.products.reduce((acc, item) => acc + Number(item.price) * (Number(item.quantity) || 1), 0);
  const deliveryCharge = subtotal >= 3000 ? 0 : isInsideDhaka ? 80 : 130;
  const total = subtotal + deliveryCharge;

  const newOrder = {
    orderId,
    customerName: orderPayload.customerName,
    phone: orderPayload.phone,
    email: orderPayload.email || '',
    district: orderPayload.district,
    area: orderPayload.area || orderPayload.district,
    address: orderPayload.address,
    notes: orderPayload.notes || '',
    products: orderPayload.products,
    totalQuantity: orderPayload.products.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0),
    subtotal,
    deliveryCharge,
    total,
    paymentMethod: 'Cash on Delivery',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  const orders = getLocalOrders();
  orders.unshift(newOrder);
  saveLocalOrders(orders);

  return {
    success: true,
    orderId,
    data: newOrder,
    message: 'Order placed successfully (Saved via local session)'
  };
}

// Fetch all orders
export async function fetchOrders(query = {}) {
  try {
    const params = new URLSearchParams();
    if (query.status && query.status !== 'all') params.append('status', query.status);
    if (query.search) params.append('search', query.search);

    const res = await fetch(`/api/orders?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Error fetching orders from server:', err.message);
  }

  let orders = getLocalOrders();
  if (query.status && query.status !== 'all') {
    orders = orders.filter(o => o.status === query.status);
  }
  if (query.search && query.search.trim()) {
    const s = query.search.trim().toLowerCase();
    orders = orders.filter(
      o =>
        o.orderId.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.phone.toLowerCase().includes(s) ||
        o.district.toLowerCase().includes(s)
    );
  }
  return orders;
}

// Fetch single order
export async function fetchOrderById(id) {
  try {
    const res = await fetch(`/api/orders/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Error fetching single order:', err.message);
  }

  const orders = getLocalOrders();
  return orders.find(o => o.orderId === id || o.phone === id) || null;
}

// Update order status
export async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Error updating status on server:', err.message);
  }

  const orders = getLocalOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (order) {
    order.status = status;
    saveLocalOrders(orders);
    return { success: true, data: order, message: `Status updated to ${status}` };
  }

  throw new Error('Order not found');
}

// Create new product
export async function createProduct(productData) {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Error creating product on server:', err.message);
  }

  // Local fallback
  const products = getLocalProducts();
  const catSlug = productData.category.toLowerCase().replace(/\s+/g, '-');
  const customId = `nm-${catSlug.slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newP = {
    ...productData,
    customId,
    categorySlug: catSlug,
    createdAt: new Date().toISOString()
  };

  products.unshift(newP);
  saveLocalProducts(products);
  return newP;
}

// Delete product
export async function deleteProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn('Error deleting product on server:', err.message);
  }

  const products = getLocalProducts();
  const filtered = products.filter(p => p.customId !== id && p._id !== id);
  saveLocalProducts(filtered);
  return true;
}

// Admin login
export async function adminLogin(username, password) {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('API login request error:', err.message);
    if ((username === 'admin' && (password === 'admin' || password === 'admin123')) || (username === 'demo' && password === 'demo123')) {
      return {
        success: true,
        token: 'demo-jwt-noir-men-session-token',
        user: { username, name: 'Store Manager', role: 'Admin' }
      };
    }
    return { success: false, message: 'Invalid credentials' };
  }
}

// Admin stats
export async function fetchAdminStats() {
  try {
    const res = await fetch('/api/admin/stats');
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn('API stats error:', err.message);
  }

  const products = getLocalProducts();
  const orders = getLocalOrders();

  return {
    success: true,
    stats: {
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'Pending').length,
      deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
      processingOrders: orders.filter(o => o.status === 'Processing').length,
      confirmedOrders: orders.filter(o => o.status === 'Confirmed').length
    },
    recentOrders: orders.slice(0, 5)
  };
}
