const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: String,
  userName: String,
  email: String,
  password: String,
  avatar: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
};
