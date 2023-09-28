const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if(authHeader) {
        jwt.verify(authHeader, process.env.CRYPTO__SEC, (err, user) => {
            if(err) return res.status(403).json('Invalid Token!');
            req.user = user;
            next();
        })
    } else {
        res.status(401).json('You are not authenticated, please login first!');
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if ( req.user.id === req.params.id || req.user.isAdmin ) {
            next()
        } else {
            res.status(403).json('You are not allowed to perform the action.')
        }
    })
}
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if ( req.user.isAdmin ) {
            next()
        } else {
            res.status(403).json('You are not allowed to perform the action.')
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }