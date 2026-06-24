const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim:true,
    },
    email: String,
    password: String,
    cart: {
        type: Array,
        default: [],
    },
    orders: {
        type: Array,
        default: [],
    },
    contact: Number,
    pictures: String,

});

module.exports = mongoose.model('users',usersSchema);