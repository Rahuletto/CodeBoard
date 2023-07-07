import mongoose from 'mongoose';
var Schema = mongoose.Schema;

/*  
{
    name: "Rahuletto",
    image: "github.com/image/something",
    email: "sdawhoidhafaLKSNDioH@(WDnkN@OnkSAD*@", (encrypted)
    boards: [
        {
            title: "TITLE",
            desc: "DESC"
            key: "12345",
            public: true
        }
    ],
    apiKey: "12345"
}
*/

var user = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  boards: {
    type: Array,
    required: false,
  },
  apiKey: {
    type: String,
    required: false,
  },
});

mongoose.models = {};

var User = mongoose.model('Users', user);

export default User;
