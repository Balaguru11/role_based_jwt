const database = require('./configuration/database');
const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const User = require('./model/user.model');

require('dotenv').config();
const conn = database.connect();
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan("tiny"));

app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// routes
const mainRoute = require('./routes/mainRoute');

app.use('/main', mainRoute);


app.get('/', (req, res) => {
    console.log("Connected");
})

const PORT = process.env.PORT || 8080
app.listen(8000, () => {
    console.log(`Project started at PORT ${PORT}`);
});