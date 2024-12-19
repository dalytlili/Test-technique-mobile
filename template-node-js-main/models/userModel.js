import mongoose from 'mongoose';

// Définir le schéma de l'utilisateur
const userSchema = new mongoose.Schema({
    username: {
        type: String,
       required: true
    },
   
    email: {
        type: String,
        required: true
    },
   
    password: {
        type: String,
        required: true
    },
   
});

// Exporter le modèle User
const User = mongoose.model('User', userSchema);
export default User;
