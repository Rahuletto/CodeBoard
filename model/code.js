import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var code = new Schema({
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

var Code = mongoose.model('CodeBoard', code);


export default Code
