// reactapp/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: '', stockQuantity: 0, imageUrl: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newOrder, setNewOrder] = useState({ customerName: '', customerEmail: '', shippingAddress: '', orderItems: [] });
  const [orderProductQuantities, setOrderProductQuantities] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('');

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleCreateProduct = async () => {
    try {
      await axios.post(`${API_BASE_URL}/products`, newProduct);
      setNewProduct({ name: '', description: '', price: 0, category: '', stockQuantity: 0, imageUrl: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`${API_BASE_URL}/products/${selectedProduct.id}`, selectedProduct);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleOrderItemQuantityChange = (productId, quantity) => {
    setOrderProductQuantities({
      ...orderProductQuantities,
      [productId]: parseInt(quantity)
    });
  };

  const handleCreateOrder = async () => {
    try {
      const orderItems = Object.keys(orderProductQuantities)
        .filter(productId => orderProductQuantities[productId] > 0)
        .map(productId => ({
          productId: parseInt(productId),
          quantity: orderProductQuantities[productId]
        }));

      const orderToCreate = { ...newOrder, orderItems };
      await axios.post(`${API_BASE_URL}/orders`, orderToCreate);
      setNewOrder({ customerName: '', customerEmail: '', shippingAddress: '', orderItems: [] });
      setOrderProductQuantities({});
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleUpdateOrderStatus = async () => {
    try {
      await axios.patch(`${API_BASE_URL}/orders/${selectedOrder.id}/status`, { status: newOrderStatus });
      setSelectedOrder(null);
      setNewOrderStatus('');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="App">
      <h1>E-commerce Admin Panel</h1>

      <section>
        <h2>Products</h2>
        <div>
          <h3>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={selectedProduct ? selectedProduct.name : newProduct.name}
            onChange={selectedProduct ? (e) => setSelectedProduct({ ...selectedProduct, name: e.target.value }) : handleProductChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={selectedProduct ? selectedProduct.description : newProduct.description}
            onChange={selectedProduct ? (e) => setSelectedProduct({ ...selectedProduct, description: e.target.value }) : handleProductChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={selectedProduct ? selectedProduct.price : newProduct.price}
            onChange={selectedProduct ? (e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) }) : handleProductChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={selectedProduct ? selectedProduct.category : newProduct.category}
            onChange={selectedProduct ? (e) => setSelectedProduct({ ...selectedProduct, category: e.target.value }) : handleProductChange}
          />
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            value={selectedProduct ? selectedProduct.stockQuantity : newProduct.stockQuantity}
            onChange={selectedProduct ? (e) => setSelectedProduct({ ...selectedProduct, stockQuantity: parseInt(e.target.value) }) : handleProductChange}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={selectedProduct ? selectedProduct.imageUrl : newProduct.imageUrl}
            onChange={selectedProduct ? (e) => setSelectedProduct({ ...selectedProduct, imageUrl: e.target.value }) : handleProductChange}
          />
          {selectedProduct ? (
            <button onClick={handleUpdateProduct}>Update Product</button>
          ) : (
            <button onClick={handleCreateProduct}>Add Product</button>
          )}
        </div>

        <h3>Product List</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price} ({product.stockQuantity} in stock)
              <button onClick={() => setSelectedProduct(product)}>Edit</button>
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Orders</h2>
        <div>
          <h3>Create New Order</h3>
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={newOrder.customerName}
            onChange={handleOrderChange}
          />
          <input
            type="email"
            name="customerEmail"
            placeholder="Customer Email"
            value={newOrder.customerEmail}
            onChange={handleOrderChange}
          />
          <input
            type="text"
            name="shippingAddress"
            placeholder="Shipping Address"
            value={newOrder.shippingAddress}
            onChange={handleOrderChange}
          />
          <h4>Add Products to Order:</h4>
          {products.map(product => (
            <div key={product.id}>
              {product.name} (Stock: {product.stockQuantity}) - Quantity:
              <input
                type="number"
                min="0"
                max={product.stockQuantity}
                value={orderProductQuantities[product.id] || 0}
                onChange={(e) => handleOrderItemQuantityChange(product.id, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleCreateOrder}>Create Order</button>
        </div>

        <h3>Order List</h3>
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              Order #{order.id} - {order.customerName} - ${order.totalAmount} - Status: {order.status}
              <button onClick={() => setSelectedOrder(order)}>Update Status</button>
            </li>
          ))}
        </ul>

        {selectedOrder && (
          <div>
            <h3>Update Order Status for Order #{selectedOrder.id}</h3>
            <input
              type="text"
              placeholder="New Status (e.g., SHIPPED, DELIVERED)"
              value={newOrderStatus}
              onChange={(e) => setNewOrderStatus(e.target.value)}
            />
            <button onClick={handleUpdateOrderStatus}>Update Status</button>
            <button onClick={() => setSelectedOrder(null)}>Cancel</button>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
