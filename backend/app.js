const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const Product = require("./models/product")
const  mongose = require("mongoose");
const { urlencoded } = require("body-parser");
const productRoutes = require("./routers/Product");
const path = require("path");

mongose.connect("mongodb+srv://nadaSoliman26012015:oHU7stnfRnQYTcXI@cluster0.sd4mg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log("conected to database")
})
.catch((err)=>{
  console.log(" conection faild!")
  console.log(err.message)
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("puplic/img", express.static(path.join("/puplic/img")))



app.use("/api/product", productRoutes)
module.exports = app;
