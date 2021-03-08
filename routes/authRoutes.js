const router = require('express').Router();
const User = require('../models/users');
const { registerValidation, loginValidation }= require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    //VALIDATE THE USER BEFORE ADDING A USER

    const { error } = registerValidation(req.body); 
    if( error )  {
        return res.status(400).send(error.details[0].message);
    }

    //check if user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) {
        return res.status(400).send('Email already exists');
    }

    //HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
    })

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (error) {
        res.status(400).send(error);
    }

})

router.post('/login', async (req, res) => {

    //validate before doing aything
    const { error } = loginValidation(req.body); 
    if( error )  {
        return res.status(400).send(error.details[0].message);
    }

    //check if the email doesnt exists
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return res.status(400).send('Invalid email or password');
    }

    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid email or password");
    
    //create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

})
module.exports = router;