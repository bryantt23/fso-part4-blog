const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, minLength: 3 },
  password: { type: String, required: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
});

// Export model
module.exports = mongoose.model('User', UserSchema);
