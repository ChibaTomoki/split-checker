const { default: mongoose } = require('mongoose')

const PersonSchema = new mongoose.Schema({
  index: Number,
  name: String,
  paid: Number,
  toPay: Number,
})

const ItemSchema = new mongoose.Schema({
  name: String,
  persons: [PersonSchema],
  note: String,
})

module.exports = mongoose.model('Item', ItemSchema)
