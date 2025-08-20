import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm'; // Assuming you'll create this
import './ProductList.css'; // Create this CSS file for styling

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showProductForm, setShowProductForm] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5); // Adjust as needed

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleProductFormClose = () => {
        setEditingProduct(null);
        setShowProductForm(false);
        fetchProducts(); // Refresh products after form submission
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = filterCategory ? product.category.toLowerCase().includes(filterCategory.toLowerCase()) : true;
        const matchesMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
        const matchesMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;
        return matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="product-list-container">
            <h2>Product Management</h2>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Filter by Category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>

            <button onClick={() => setShowProductForm(true)}>Create New Product</button>

            {showProductForm && (
                <ProductForm product={editingProduct} onClose={handleProductFormClose} />
            )}

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>{product.category}</td>
                            <td>{product.stockQuantity}</td>
                            <td>
                                <button onClick={() => handleEdit(product)}>Edit</button>
                                <button onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
                    <button key={i + 1} onClick={() => paginate(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
