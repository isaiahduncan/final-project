var mongoose = require('mongoose')

mongoose.Promise = global.Promise

var albumSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true
    }, 
    year:{
        type: Number,
        required: true
    }
})

var artistSchema = new mongoose.Schema({
  name:{
    type: String, 
    required: true
  },
  label:{
    type: String, 
    required: true
  },
  albums:{
    type: [albumSchema], 
    required: true
  },
  genre:{
    type: String, 
    required: true
  },
  IGFollowers:{
    type: Number, 
    required: true
  },
  ref:{
    type: String, 
    required: true
  },
  src:{
    type: String, 
    required: true
  }
})

var Artist = mongoose.model('artist', artistSchema)
module.exports = Artist