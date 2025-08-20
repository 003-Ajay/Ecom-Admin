import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductForm.css'; // Create this CSS file for styling

const ProductForm = ({ product, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stockQuantity: '',
        imageUrl: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                stockQuantity: product.stockQuantity,
                imageUrl: product.imageUrl || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stockQuantity: '',
                imageUrl: ''
            });
        }
        setErrors({});
        setMessage('');
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be positive';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) newErrors.stockQuantity = 'Stock quantity must be non-negative';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            setMessage('Please correct the errors in the form.');
            return;
        }

        try {
            if (product) {
                await axios.put(`http://localhost:8080/api/products/${product.id}`, formData);
                setMessage('Product updated successfully!');
            } else {
                await axios.post('http://localhost:8080/api/products', formData);
                setMessage('Product created successfully!');
            }
            setTimeout(() => {
                onClose(); // Close form after successful submission
            }, 1500);
        } catch (error) {
            console.error('Error submitting product:', error);
            setMessage('Error submitting product. Please try again.');
        }
    };

    return (
        <div className="product-form-overlay">
            <div className="product-form-modal">
                <h3>{product ? 'Edit Product' : 'Create Product'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        {errors.name && <span className="error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                        {errors.description && <span className="error">{errors.description}</span>}
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" />
                        {errors.price && <span className="error">{errors.price}</span>}
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} />
                        {errors.category && <span className="error">{errors.category}</span>}
                    </div>
                    <div className="form-group">
                        <label>Stock Quantity:</label>
                        <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} />
                        {errors.stockQuantity && <span className="error">{errors.stockQuantity}</span>}
                    </div>
                    <div className="form-group">
                        <label>Image URL (Optional):</label>
                        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                    </div>
                    {message && <p className="message">{message}</p>}
                    <div className="form-actions">
                        <button type="submit">{product ? 'Update Product' : 'Create Product'}</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
