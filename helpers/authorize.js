const jwt = require('jsonwebtoken');
const { secret } = process.env.SECRET;

function authorize(roles = []){
    if(typeof roles == 'string'){
        roles = [roles];
    } else {
        return [jwt({secret, algorithms: []})]
    }
}

function reverseString(str) {
    return str.split("").reverse().join("");
}

module.exports = {authorize, reverseString }