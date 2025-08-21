package com.example.ecommerce.controller;

import com.example.ecommerce.model.OrderRequest;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.service.OrderService;
import com.example.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest) {
        // Validate product existence
        if (!productService.existsById(orderRequest.getProductId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        Order order = orderService.createOrder(orderRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }
}
