import express from 'express';
import { body } from 'express-validator';
import multer from '../middlewares/multer-config.js';
import { addOnce, updateOnce, getAll, getOneById, deleteOnce } from '../controllers/ProductController.js';

const router = express.Router();

// Handling routes for the '/products' endpoint
router.route('/')
    .get(getAll)  // GET request to retrieve all products
    .post(
        multer,  // Using multer middleware to handle file uploads
        [
            body('name').notEmpty().withMessage('Name is required'),
            body('quantity').notEmpty().withMessage('Quantity is required'),
            body('unit').notEmpty().withMessage('Unit is required'),
            body('description').notEmpty().withMessage('Description is required'),
            body('price').notEmpty().withMessage('Price is required')
        ], 
        addOnce
    );

// Handling routes for the '/products/:id' endpoint
router.route('/:id')
    .get(getOneById)  // GET request to retrieve a product by ID
    .put(
        multer,  // Using multer middleware to handle file uploads
        [
            body('name').notEmpty().withMessage('Name is required')
        ], 
        updateOnce
    )
    .delete(deleteOnce);  // DELETE request to delete a product by ID

// Exporting the router for use in other modules
export default router;
