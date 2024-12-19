import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { 
    userRegister,
    loginUser,
   
    refreshToken,
    logout,

   
} from '../controllers/userController.js'; // Import correct named functions
import { 
    registerValidator,
    loginValidator,
} from '../helpers/validation.js'; // Correct import
import { VerifyToken } from '../middlewares/auth.js';

// Create an Express router
const router = express.Router();

// Get the current file's directory path (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, path.join(__dirname, '../public/images'));
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

const upload = multer({
    storage,
    fileFilter
});

// Route handlers
router.post('/signup', registerValidator, userRegister);
router.post('/login', loginValidator, loginUser);
router.get('/refresh-token', VerifyToken, refreshToken)
router.get('/logout', VerifyToken, logout)

export default router;
