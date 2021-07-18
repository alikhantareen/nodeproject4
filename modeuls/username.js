const mongoose = require('mongoose')

const { Schema } = mongoose

let userSchema = new Schema({
    username : String
})

let User = mongoose.model('User', userSchema)

module.exports.User = User