package com.examly.springapp.service;

import com.examly.springapp.model.Product;
import com.examly.springapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product createProduct(Product product) {
        // Product validation
        if (product.getName() == null || product.getName().isEmpty() ||
            product.getDescription() == null || product.getDescription().isEmpty() ||
            product.getPrice() == null || product.getPrice() <= 0 ||
            product.getCategory() == null || product.getCategory().isEmpty() ||
            product.getStockQuantity() == null || product.getStockQuantity() < 0) {
            throw new IllegalArgumentException("All fields except image URL are required, and price must be positive.");
        }
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            // Product validation
            if (productDetails.getName() == null || productDetails.getName().isEmpty() ||
                productDetails.getDescription() == null || productDetails.getDescription().isEmpty() ||
                productDetails.getPrice() == null || productDetails.getPrice() <= 0 ||
                productDetails.getCategory() == null || productDetails.getCategory().isEmpty() ||
                productDetails.getStockQuantity() == null || productDetails.getStockQuantity() < 0) {
                throw new IllegalArgumentException("All fields except image URL are required, and price must be positive.");
            }

            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setCategory(productDetails.getCategory());
            product.setStockQuantity(productDetails.getStockQuantity());
            product.setImageUrl(productDetails.getImageUrl());
            return productRepository.save(product);
        }
        return null;
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
