const database = require('./configuration/database');
const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const morgan = require('morgan');
const cors = require('cors')

require('dotenv').config();
const conn = database.connect();
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// routes
const mainRoute = require('./routes/mainRoute');
const postRoute = require('./routes/postsRoute');
app.use('/main', mainRoute);
app.use('/post', postRoute);

app.get('/', (req, res) => {
    console.log("Connected");
})

const PORT = process.env.PORT || 8080
app.listen(8000, () => {
    console.log(`Project started at PORT ${PORT}`);
});

/*
// 1. Login - Login completed
// 2. Register - Register completed
// 3. Register Verification - completed, 2 routes added (resent verification code)
// 4 Password Reset - 
// 5. Profile get
// 6. Profile update
// 7. Create a post - Create a Post by School, Staff and Employee. Student restricted to access this route.
// 8. Update a post - Post can be updated by the user who created it. Students are not eligible to update Posts.
// 9. Delete a post - Delete a Post can be possible only if the logged in user created the post.
// 10. get All my posts - Done. (deleted posts not visible)

*/