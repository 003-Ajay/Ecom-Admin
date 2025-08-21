package com.examly.springapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
    private Double priceAtPurchase;

    // Private constructor for Builder
    private OrderItem(Builder builder) {
        this.id = builder.id;
        this.order = builder.order;
        this.product = builder.product;
        this.quantity = builder.quantity;
        this.priceAtPurchase = builder.priceAtPurchase;
    }

    // Getters and Setters

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Order order;
        private Product product;
        private Integer quantity;
        private Double priceAtPurchase;

        public Builder setId(Long id) {
            this.id = id;
            return this;
        }

        public Builder setOrder(Order order) {
            this.order = order;
            return this;
        }

        public Builder setProduct(Product product) {
            this.product = product;
            return this;
        }

        public Builder setQuantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder setPriceAtPurchase(Double priceAtPurchase) {
            this.priceAtPurchase = priceAtPurchase;
            return this;
        }

        public OrderItem build() {
            return new OrderItem(this);
        }
    }
}
