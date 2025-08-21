package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customerName;
    private String customerEmail;
    private String shippingAddress;
    private Double totalAmount;
    private String status;
    private LocalDateTime orderDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    // Private constructor for Builder
    private Order(Builder builder) {
        this.id = builder.id;
        this.customerName = builder.customerName;
        this.customerEmail = builder.customerEmail;
        this.shippingAddress = builder.shippingAddress;
        this.totalAmount = builder.totalAmount;
        this.status = builder.status;
        this.orderDate = builder.orderDate;
        this.orderItems = builder.orderItems;
    }

    // Getters and Setters

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String customerName;
        private String customerEmail;
        private String shippingAddress;
        private Double totalAmount;
        private String status;
        private LocalDateTime orderDate;
        private List<OrderItem> orderItems;

        public Builder setId(Long id) {
            this.id = id;
            return this;
        }

        public Builder setCustomerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public Builder setCustomerEmail(String customerEmail) {
            this.customerEmail = customerEmail;
            return this;
        }

        public Builder setShippingAddress(String shippingAddress) {
            this.shippingAddress = shippingAddress;
            return this;
        }

        public Builder setTotalAmount(Double totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public Builder setStatus(String status) {
            this.status = status;
            return this;
        }

        public Builder setOrderDate(LocalDateTime orderDate) {
            this.orderDate = orderDate;
            return this;
        }

        public Builder setOrderItems(List<OrderItem> orderItems) {
            this.orderItems = orderItems;
            return this;
        }

        public Order build() {
            return new Order(this);
        }
    }
}
