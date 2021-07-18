const mongoose = require('mongoose')

const { Schema } = mongoose

let exerciseData = new Schema({
    username : String,
    date : String,
    duration  : Number,
    description : String
})

let Exercise = mongoose.model("Exercise", exerciseData)

module.exports.Exercise = Exercise