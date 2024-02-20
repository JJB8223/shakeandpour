package com.estore.api.estoreapi.controller;


import com.estore.api.estoreapi.model.Product;
import com.estore.api.estoreapi.persistence.InventoryDAO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Io;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Test the Inventory Controller class and its methods
 *
 * @author Matthew Morrison msm8275
 */
@Tag("Controller-tier")
public class InventoryControllerTest {
    private InventoryController inventoryController;
    private InventoryDAO mockInventoryDAO;

    /**
     * Before each test, create a new InventoryController object
     * and inject a mock Inventory DAO
     */
    @BeforeEach
    public void setupInventoryController(){
        mockInventoryDAO = mock(InventoryDAO.class);
        inventoryController = new InventoryController((mockInventoryDAO));
    }

    @Test
    public void testCreateProduct() throws IOException{
        // Setup
        Product p = new Product(99, "Soda", 2.99f, 20);
        // when createInventory is called, return true simulating successful
        // creation and save
        when(mockInventoryDAO.createProduct(p)).thenReturn(p);

        // invoke
        ResponseEntity<Product> response = inventoryController.createProduct(p);

        // analyze
        assertEquals(HttpStatus.CREATED,response.getStatusCode());
        assertEquals(p,response.getBody());
    }

    @Test
    public void testProductSearch() throws IOException {
        // Setup
        String searchString = "la";
        Product[] products = new Product[2];
        products[0] = new Product(99,"Mineral Water",3.40f,25);
        products[1] = new Product(98,"Rose Water",3.40f,25);
        // When findProducsts is called with the search string, return the two
        /// products above
        when(mockInventoryDAO.findProducts(searchString)).thenReturn(products);
        
        // Invoke
        ResponseEntity<Product[]> response = inventoryController.searchProducts(searchString);
        
        // Analyze
        assertEquals(HttpStatus.OK,response.getStatusCode());
        assertEquals(products, response.getBody());
    }

    @Test
    public void testProductSearchFail() throws IOException{
        // Setup
        String searchString = "an";
        // When createProduct is called on the Mock Hero DAO, throw an IOException
        doThrow(new IOException()).when(mockInventoryDAO).findProducts(searchString);

        // Invoke
        ResponseEntity<Product[]> response = inventoryController.searchProducts(searchString);

        // Analyze
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR,response.getStatusCode());
    }

    @Test
    public void testCreateHeroFail() throws IOException{
        // Setup
        Product p = new Product(99, "Soda", 2.99f, 20);
        // when createInventory is called, return false simulating failed
        // creation and save
        when(mockInventoryDAO.createProduct(p)).thenReturn(null);

        // invoke
        ResponseEntity<Product> response = inventoryController.createProduct(p);

        // analyze
        assertEquals(HttpStatus.CONFLICT,response.getStatusCode());
    }

}
