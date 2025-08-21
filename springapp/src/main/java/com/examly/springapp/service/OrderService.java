// src/main/java/com/examly/springapp/service/OrderService.java
package com.examly.springapp.service;

import com.examly.springapp.dto.OrderCreateRequest;
import com.examly.springapp.dto.OrderItemCreateRequest;
import com.examly.springapp.exception.CustomExceptionHandler;
import com.examly.springapp.model.Order;
import com.examly.springapp.model.OrderItem;
import com.examly.springapp.model.Product;
import com.examly.springapp.repository.OrderItemRepository;
import com.examly.springapp.repository.OrderRepository;
import com.examly.springapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order createOrder(OrderCreateRequest orderCreateRequest) {
        Order order = new Order();
        order.setCustomerName(orderCreateRequest.getCustomerName());
        order.setCustomerEmail(orderCreateRequest.getCustomerEmail());
        order.setShippingAddress(orderCreateRequest.getShippingAddress());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        Double totalAmount = 0.0;
        List<OrderItem> orderItems = orderCreateRequest.getOrderItems().stream()
                .map(itemRequest -> {
                    Product product = productRepository.findById(itemRequest.getProductId())
                            .orElseThrow(() -> new CustomExceptionHandler.ResourceNotFoundException("Product not found with ID: " + itemRequest.getProductId()));

                    OrderItem orderItem = new OrderItem();
                    orderItem.setProduct(product);
                    orderItem.setQuantity(itemRequest.getQuantity());
                    orderItem.setPriceAtPurchase(product.getPrice());
                    orderItem.setOrder(order);
                    return orderItem;
                })
                .collect(Collectors.toList());

        for (OrderItem item : orderItems) {
            totalAmount += item.getQuantity() * item.getPriceAtPurchase();
        }
        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomExceptionHandler.ResourceNotFoundException("Order not found with ID: " + orderId));
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomExceptionHandler.ResourceNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
