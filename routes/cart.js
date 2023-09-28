const router = require('express').Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken} = require('./verifyToken.js');
const CryptoJS = require('crypto-js');
const Cart = require('../models/cart.js');


// CREATE CART
router.post('/', verifyToken, async (req, res)=>{
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch(err) {
        res.status(500).json(err);
    }
})
// UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
            {
                new: true
            }
        );
        res.status(200).json(updatedCart)
    } catch(err) {
        res.status(503).json(err)
    }
})

// DELETE PRODUCT
router.delete('/:id', verifyTokenAndAuthorization, async (req, res)=> {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Your cart has been Successfully deleted!');
    } catch (err) {
        res.status(500).json(err);
    }
})

// GET USER CART
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res)=> {
    try {
        const cart = await Cart.findOne({userId: req.params.id});
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
})

// GET ALL CARTS
router.get('/', verifyTokenAndAdmin, async (req, res)=> {
    try {
        const cart = await Cart.find();
        res.status(200).json(cart);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router