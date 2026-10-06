package com.shophere.service;

import com.shophere.entity.Product;
import com.shophere.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service 
public class ProductService{
    private final ProductRepository productRepository;
    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }
    public Product saveProduct(Product product){
        return productRepository.save(product);
    }
    public Product addProduct(Product product){
        return productRepository.save(product);
    }
    public void deleteProduct(Long id){
        productRepository.deleteById(id);
    }
}