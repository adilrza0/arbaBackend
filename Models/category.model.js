const { default: mongoose } = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    image: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  });
  
const Category = mongoose.model('Category', CategorySchema);

module.exports={
    Category
}