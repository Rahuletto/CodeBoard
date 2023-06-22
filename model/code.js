import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var board = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  files: {
    type: Array,
    required: true
  },
  options: {
    type: Array,
    required: false
  },
  key: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    required: true
  }
});


mongoose.models = {};

var Code = mongoose.model('CodeBoard', board);


export default Code
