package com.shophere.controller;

import com.shophere.entity.Product;
import com.shophere.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/products")
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
@PostMapping
public Product addProduct(
        @RequestBody Product product){

    return productService.addProduct(
        product
    );
}
@DeleteMapping("/{id}")
public void deleteProduct(
        @PathVariable Long id){

    productService.deleteProduct(
        id
    );
}
}