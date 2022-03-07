const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {type: String, enum: ['Student', 'Faculty', 'Employee', 'School'], required: true},
    email: {type: String, required: true, unique: true, default: null, lowercase: true},
    mobile: {type: Number, minlength: 10},
    username: { type: String, default: null, unique: true, lowercase: true},
    password: { type: String, default: null, minlength: 8 },
    verify_g: { type: String},
    verify_status: { type: String, enum: ['Verified', 'Pending'], required: true},
    deleted_at: {type: String}
})

userSchema.set('timestamps', true);

module.exports = mongoose.model('User', userSchema);