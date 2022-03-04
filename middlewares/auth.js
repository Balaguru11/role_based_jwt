const jwt = require('jsonwebtoken');
const { secret } = process.env.SECRET;

exports.authentic((req, res, next) => {
    const head = req.headers;
    console.log(head);
})