const http = require("http")
const app = require("./backend/app")
const port = 9097


app.set('port', port)
const express = require("express")
//var server=express()

http.createServer(app)

app.listen(port)

