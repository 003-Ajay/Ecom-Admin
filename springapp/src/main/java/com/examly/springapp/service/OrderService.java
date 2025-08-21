package com.examly.springapp.service;

import com.examly.springapp.dto.OrderCreateRequest;
import com.examly.springapp.dto.OrderItemCreateRequest;
import com.examly.springapp.model.Order;
import com.examly.springapp.model.OrderItem;
import com.examly.springapp.model.Product;
import com.examly.springapp.repository.OrderItemRepository;
import com.examly.springapp.repository.OrderRepository;
import com.examly.springapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Transactional
    public Order createOrder(OrderCreateRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setShippingAddress(request.getShippingAddress());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemCreateRequest itemRequest : request.getOrderItems()) {
            Optional<Product> productOptional = productRepository.findById(itemRequest.getProductId());
            if (!productOptional.isPresent()) {
                throw new RuntimeException("Product with ID " + itemRequest.getProductId() + " not found.");
            }
            Product product = productOptional.get();

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order); // Set the order for the order item
            orderItem.setProductId(product.getId());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice()); // Record price at purchase
            orderItem.setOrder(order); // Link order item to the order

            orderItems.add(orderItem);
            totalAmount += product.getPrice() * itemRequest.getQuantity();

            // Decrease stock quantity
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder); // Ensure order reference is set for saving
            orderItemRepository.save(item);
        }
        return savedOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order updateOrderStatus(Long id, String newStatus) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setStatus(newStatus);
            return orderRepository.save(order);
        }
        return null;
    }
}
