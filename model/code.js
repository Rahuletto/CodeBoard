import mongoose from 'mongoose';
var Schema = mongoose.Schema;

/*  
{
    name: "Board title",
    description: "Description",
    files: [
      {
        name: "untitled.js",
        language: "javascript",
        value: "12pod20nd*8H@SDLAE!(n*@hd" (encrypted)
      }
    ],
    options: [{encrypt: bool, autoVanish: bool, fork: { title: "Forked title", key: "key", status: true } }],
    key: "123456",
    createdAt: 1628261284
}
*/

var board = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  files: {
    type: Array,
    required: true,
  },
  options: {
    type: Array,
    required: false,
  },
  key: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
});

mongoose.models = {};

var Code = mongoose.model('Production-CodeBoard', board);

export default Code;
