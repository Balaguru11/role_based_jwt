const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 6},
    description: {type: String},
    content: {type: String, minlength: 160, required: true},
    created_by: {required: true, type: String}
})

module.exports = mongoose.model('Post', postSchema);
