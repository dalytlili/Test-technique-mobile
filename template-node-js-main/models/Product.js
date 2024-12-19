import mongoose from "mongoose";

// Destructuring the Schema and model objects from the mongoose module
const { Schema, model } = mongoose;

// Creating a new Mongoose schema for the 'Test' model
const testSchema = new Schema({
    // Defining a field 'name' of type String, which is required
    name: {
        type: String,
        required: true
    },
    
    quantity: {
        type: Number,
        required: true,  // Ensure the quantity is provided
    },
    unit: {
        type: String,
        required: true,  // Ensure the unit is provided (e.g., "1kg")
    },
    description: {
        type: String,
        required: true,  // Ensure the description is provided
    },
    price: {
        type: Number,
        required: true,  // Ensure the price is provided
    }});

// Creating and exporting the 'Test' model using the defined schema
export default model('Product', testSchema);
