const  jwt  = require("jsonwebtoken");

function verifyJWT(req, res, next) {
    const token = req.headers.auth;
    if (!token) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded.email;
        next();
    });
}
module.exports = verifyJWT