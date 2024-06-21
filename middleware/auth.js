const jwt = require('jsonwebtoken'); // import the jsonwebtoken package

module.exports = function (req, res, next) {
    const token = req.header('Authorization'); // extract the token from the Authorization header
    if(!token) {
        return res.status(401).json({ message: 'No token, Authorization denied' }); // if there is no token, return an error response
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        req.user = decoded; // set the user in the request object
        next(); // call the next middleware
    }catch (error) {
        res.status(401).json({ message: 'Token is not valid' }); // if the token is invalid, return an error response
    }
};