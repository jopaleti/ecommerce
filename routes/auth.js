const router = require('express').Router();
const User = require('../models/user.js');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
// REGISTER
router.post('/register', async (req, res)=> {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.CRYPTO__SEC
            ).toString(),
    })
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
        console.log(savedUser)
    } catch(err) {
        res.status(501).json(err)
        console.log(err)
    }
})
router.post('/login', async (req, res)=> {
    try {
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json('Username does not exist');

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO__SEC);
        const Password = hashedPassword.toString(CryptoJS.enc.Utf8);
        console.log(Password);
        // Validating the password
        Password !== req.body.password && 
            res.status(401).json('Password does not match, please try again.');

        // INITIALIZING ACCESSTOKEN
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.CRYPTO__SEC, {expiresIn: "7d"});

        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken});
    } catch(err) {
        console.log(err)
    }
})

module.exports = router