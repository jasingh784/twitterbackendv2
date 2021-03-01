const { func } = require('joi');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //check if there is a token in the header
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    //verify token. 
    try {
        //returns the payload if verified
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
    } catch (error) {
        res.status(400).send("Invalid Token");
    }

    next()
}