const express = require('express');
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const jwt= require('jsonwebtoken');



const router = express.Router();

// Render Registration Page
router.get('/register', (req, res) => {
    res.render('register');
});

// POST: Register User
router.post(
    '/register',
    [
        // Email validation
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please provide a valid email address.')
            .isLength({ min: 6 })
            .withMessage('Email must be at least 6 characters long.'),
        
        // Username validation
        body('Username')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long.'),
        
        // Password validation
        body('password')
            .trim()
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long.'),
    ],
    async (req, res) => {
        try {
            // Validate the request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const formattedErrors = errors.array().map(err => ({
                    field: err.param,
                    message: err.msg,
                }));
                return res.status(400).json({
                    message: 'Validation failed. Please check your input.',
                    errors: formattedErrors,
                });
            }

            const { email, Username, password } = req.body;

            // Check for existing user by email
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already registered.' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = await userModel.create({
                email,
                Username,
                password: hashedPassword,
            });

            // Respond with the newly created user (exclude sensitive data)
            return res.status(201).json({
                message: 'User registered successfully.',
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    Username: newUser.Username,
                },
            });
        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
        }
    }
);

router.get('/login', (req,res)=>{
    res.render('login')
})

router.post('/login',
    body('Username')            
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long.'),

        
        // Password validation
    body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),

    async (req,res)=>{
        const errors= validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'invalid data',
            })
        }

        const {Username,password}= req.body;

        const user= await userModel.findOne({
            Username: Username
        })
        
        if(!user){
            return res.status(400).json({
                message: 'username or password is incorrect'
            })
        }

        const isMatch= await bcrypt.compare(password,user.password)
        
        if(!isMatch){
            return res.status(400).json({
                message: 'username or password is incorrect'
            })
        }

        const token= jwt.sign({
            userId: user._id,
            email: user.email,
            Username: user.Username
        },
            process.env.JWT_SECRET,
        )

        res.cookie('token', token)

        res.send('logged in')
    }    


    
            


    

)

module.exports = router;
