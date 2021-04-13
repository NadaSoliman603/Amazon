const  mongose = require("mongoose");


const ProductSchema = mongose.Schema({
  ProductName: {type:String, require:true },
  productDiscription: {type:String, require:true },
  imagePath:  {type:String, require:true }
})

module.exports = mongose.model("Product", ProductSchema)


