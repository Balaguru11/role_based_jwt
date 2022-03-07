const jwt = require('jsonwebtoken');
const token_key = process.env.TOKEN_KEY;

module.exports = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log(`Token is Here: ${token}`);
    // const token = req.header('x-auth-token');
    // console.log(token);

    if(!token) {
        return res.json({status: 'fail', msg: 'No token found'})
    }

    try {
        let user = await jwt.verify(token, token_key);
        // console.log(user);
        req.user = user;
        next()
    } catch (err) {
        return res.json({status: 'fail', msg: 'Token invalid', err})
    }
}