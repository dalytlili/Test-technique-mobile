import { validationResult } from 'express-validator';
import test from '../models/Product.js';

// Controller function to create a new test
export function addOnce(req, res) {
    // Check if there are validation errors
    if (!validationResult(req).isEmpty()) {
        // Respond with 400 Bad Request and the validation errors
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        // If there are no validation errors, create a new test
        test.create({
            // Extracting 'name' and 'image' from the request body
            name: req.body.name,
            quantity: req.body.quantity,
            unit: req.body.unit,
            description: req.body.description,
            price: req.body.price,
        })
            .then((newTest) => {
                // Respond with 201 Created and the created test details
                res.status(201).json({
                    name: newTest.name,
                    quantity: newTest.quantity,
                    unit: newTest.unit,
                    description: newTest.description,
                    price: newTest.price,
                });
            })
            .catch((err) => {
                // Respond with 500 Internal Server Error and the error details
                res.status(500).json({ error: err });
            });
    }
}

// Controller function to update a test by ID
export function updateOnce(req, res) {
    // Check if there are validation errors
    if (!validationResult(req).isEmpty()) {
        // Respond with 400 Bad Request and the validation errors
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        // If there are no validation errors, update the test by ID
        test.findByIdAndUpdate(
            req.params.id,
            {
                // Updating 'name' and 'image' with the values from the request body
                name: req.body.name,
                quantity: req.body.quantity,
                unit: req.body.unit,
                description: req.body.description,
                price: req.body.price,
            },
            { new: true } // Return the updated test
        )
            .then((updatedTest) => {
                // Check if the menu exists
                if (!updatedTest) {
                    return res.status(404).json({ message: 'product not found' });
                }
                // Respond with the updated test details
                res.json({
                    name: updatedTest.name,
                    quantity: updatedTest.quantity,
                    unit: updatedTest.unit,
                    description: updatedTest.description,
                    price: updatedTest.price,
                });
            })
            .catch((err) => {
                // Respond with 500 Internal Server Error and the error details
                res.status(500).json({ error: err });
            });
    }
}

// Controller function to get all test
export function getAll(req, res) {
    // Retrieve all tests from the database
    test.find()
        .then((tests) => {
            // Respond with the array of tests
            res.json(tests);
        })
        .catch((err) => {
            // Respond with 500 Internal Server Error and the error details
            res.status(500).json({ error: err });
        });
}

// Controller function to get a test by ID
export function getOneById(req, res) {
    // Find the test by ID in the database
    test.findById(req.params.id)
        .then((foundTest) => {
            // Check if the test exists
            if (!foundTest) {
                return res.status(404).json({ message: 'product not found' });
            }
            // Respond with the test details
            res.json(foundTest);
        })
        .catch((err) => {
            // Respond with 500 Internal Server Error and the error details
            res.status(500).json({ error: err });
        });
}

// Controller function to delete a test by ID
export function deleteOnce(req, res) {
    // Delete the test by ID from the database
    test.findByIdAndDelete(req.params.id)
        .then((deletedTest) => {
            // Check if the test exists
            if (!deletedTest) {
                return res.status(404).json({ message: 'product not found' });
            }
            // Respond with a success message
            res.json({ message: 'product deleted successfully' });
        })
        .catch((err) => {
            // Respond with 500 Internal Server Error and the error details
            res.status(500).json({ error: err });
        });
}
