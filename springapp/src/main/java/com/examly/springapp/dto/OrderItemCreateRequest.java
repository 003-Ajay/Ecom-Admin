// src/main/java/com/examly/springapp/dto/OrderItemCreateRequest.java
package com.examly.springapp.dto;

public class OrderItemCreateRequest {
    private Long productId;
    private Integer quantity;

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
