import User from '../models/userModel.js'; // Assuming this is your User model
import bcrypt from 'bcrypt'; // Importing bcrypt for password hashing
import { validationResult } from 'express-validator'; // Assuming validation middleware is used
import jwt from 'jsonwebtoken';


// Derive __dirname from import.meta.url


// Function to handle user registration
const userRegister = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Erreurs de validation',
                errors: errors.array()
            });
        }

        const { username, email, password } = req.body;

        // Check if the user already exists
        const isExists = await User.findOne({ email });
        if (isExists) {
            return res.status(400).json({
                success: false,
                msg: 'Email déjà utilisé'
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashPassword,
        });

        // Save the user to the database
        const userData = await newUser.save();

        // Commenting out or removing the email sending logic
        // const subject = 'Vérifiez votre email';
        // const content = `<p>Bonjour ${username}, veuillez <a href="http://127.0.0.1:9098/mail-verif/${userData._id}">cliquer ici</a> pour vérifier votre adresse email.</p>`;
        // await sendMail(email, subject, content);

        return res.status(200).json({
            success: true,
            msg: 'Inscription réussie !',
            user: userData
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);

        return res.status(500).json({
            success: false,
            msg: 'Échec de l\'inscription de l\'utilisateur.',
            error: error.message
        });
    }
};






// Function to generate an access token
const generateAccessToken = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
    return token;
};

const generateRefreshToken = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "4h" });
    return token;
};

// Function to handle user login
const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: 'Email and Password are Incorrect!'
            });
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Email and Password are Incorrect!'
            });
        }

     

        const accessToken = await generateAccessToken({ user: userData });
        const refreshToken = await generateRefreshToken({ user: userData });

        
        return res.status(200).json({
            success: true,
            msg: 'Login Successfully!!',
            user: userData,
            accessToken: accessToken,
            refreshToken:refreshToken,
            tokenType: 'Bearer'
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};




const refreshToken = async(req,res)=>{
    try{
        const userId = req.user._id;
        const userData = await User.findOne({ _id:userId});

        const accessToken =await generateAccessToken({ user:userData})
        const refreshToken = await generateRefreshToken({ user:userData})

        return res.status(200).json({
            success: true,
            msg: 'Token Refreshed! ',
            accessToken:accessToken,
            refreshToken:refreshToken
        });
    }catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}

const logout = async(req,res)=>{
    try{

        const token = req.body.token || req.query.token || req.headers['authorization']
        const bearer = token.split(' ');
        const bearerToken = bearer[1];

        const newBlacklist = new Blacklist({
            token:bearerToken
        })

        await newBlacklist.save();
        res.setHeader('Clear-Site-Data', '"cookies","storage"');
        return res.status(200).json({
            success: true,
            msg: 'You are logged out!'
        });

    }catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }

}








 
export { userRegister,  loginUser, refreshToken, logout };
