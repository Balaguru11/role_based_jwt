const timespan = require('jsonwebtoken/lib/timespan');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 6},
    description: {type: String},
    content: {type: String, minlength: 160, required: true},
    created_by: {required: true, type: String},
    visibility: {type: String, required: true, enum:['Public', 'Private']},
    deleted_at: {type: String}
})

postSchema.set('timestamps', true);

module.exports = mongoose.model('Post', postSchema);
