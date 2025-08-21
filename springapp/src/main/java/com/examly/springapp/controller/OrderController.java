package com.examly.springapp.controller;

import com.examly.springapp.dto.OrderCreateRequest;
import com.examly.springapp.model.Order;
import com.examly.springapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderCreateRequest orderCreateRequest) {
        Order createdOrder = orderService.createOrder(orderCreateRequest);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestBody String newStatus) {
        Order order = orderService.updateOrderStatus(orderId, newStatus);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @ExceptionHandler(CustomExceptionHandler.ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(CustomExceptionHandler.ResourceNotFoundException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
