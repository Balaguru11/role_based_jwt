const mongoose = require('mongoose');

require('dotenv').config();

const conn_string = process.env.MONGO_URI;

exports.connect = () => {
    mongoose.connect(conn_string, {useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('Database connected successfully')
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    });
};