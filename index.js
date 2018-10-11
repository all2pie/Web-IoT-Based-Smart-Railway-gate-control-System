var express = require("express"),
    app     = express(),
    mongo   = require("mongoose"),
    parser  = require("body-parser"),
    http    = require('http').Server(app),
    io      = require("socket.io")(http);
    
    app.use(express.static("public"));    
    app.use(parser.urlencoded({extended:true}));
    app.set("view engine","ejs");
    
    
    
app.get("/",function (req,res) {
    res.render("home");
});

io.on('connection', function(socket){
    console.log("got a connection")
  socket.on('location', function(lat,lan,speed){
      console.log(lat,lan,speed)
      io.emit("loc",lat,lan,speed)
    });
});

http.listen(process.env.PORT,process.env.IP,function () {
    console.log("Server Strated....");
});