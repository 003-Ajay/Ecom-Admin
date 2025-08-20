import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderDetail.css'; // Create this CSS file for styling

const OrderDetail = ({ order, onClose }) => {
    const [orderData, setOrderData] = useState(order);
    const [newStatus, setNewStatus] = useState(order.status);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch full order details if needed, as the initial 'order' prop might be partial
        const fetchFullOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/orders/${order.id}`);
                setOrderData(response.data);
                setNewStatus(response.data.status);
            } catch (error) {
                console.error('Error fetching full order details:', error);
                setMessage('Error loading order details.');
            }
        };
        fetchFullOrder();
    }, [order.id]);

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value);
    };

    const handleUpdateStatus = async () => {
        try {
            const response = await axios.patch(`http://localhost:8080/api/orders/${orderData.id}/status`, { status: newStatus });
            setOrderData(response.data); // Update with the response from the backend
            setMessage('Order status updated successfully!');
            // Optionally, refresh the parent list after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error updating order status:', error);
            setMessage('Error updating status. Please try again.');
        }
    };

    if (!orderData) {
        return <div className="order-detail-overlay">Loading order details...</div>;
    }

    return (
        <div className="order-detail-overlay">
            <div className="order-detail-modal">
                <h3>Order Details (ID: {orderData.id})</h3>
                <p><strong>Customer Name:</strong> {orderData.customerName}</p>
                <p><strong>Customer Email:</strong> {orderData.customerEmail}</p>
                <p><strong>Shipping Address:</strong> {orderData.shippingAddress}</p>
                <p><strong>Total Amount:</strong> ${orderData.totalAmount.toFixed(2)}</p>
                <p><strong>Order Date:</strong> {new Date(orderData.orderDate).toLocaleString()}</p>

                <div className="form-group">
                    <label><strong>Status:</strong></label>
                    <select value={newStatus} onChange={handleStatusChange}>
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                    </select>
                    <button onClick={handleUpdateStatus}>Update Status</button>
                </div>

                <h4>Order Items:</h4>
                {orderData.orderItems && orderData.orderItems.length > 0 ? (
                    <ul>
                        {orderData.orderItems.map(item => (
                            <li key={item.id}>
                                Product ID: {item.productId}, Quantity: {item.quantity}, Price at Purchase: ${item.priceAtPurchase.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items in this order.</p>
                )}

                {message && <p className="message">{message}</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default OrderDetail;
