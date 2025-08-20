import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderDetail from './OrderDetail'; // Assuming you'll create this
import './OrderList.css'; // Create this CSS file for styling

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5); // Adjust as needed

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
        fetchOrders(); // Refresh orders after closing details (in case status was updated)
    };

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="order-list-container">
            <h2>Order Management</h2>

            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Order Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerName}</td>
                            <td>${order.totalAmount.toFixed(2)}</td>
                            <td>{order.status}</td>
                            <td>{new Date(order.orderDate).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleViewDetails(order)}>View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, i) => (
                    <button key={i + 1} onClick={() => paginate(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>

            {selectedOrder && (
                <OrderDetail order={selectedOrder} onClose={handleCloseDetails} />
            )}
        </div>
    );
};

export default OrderList;
