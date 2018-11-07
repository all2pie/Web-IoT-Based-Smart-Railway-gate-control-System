var express = require("express"),
    app     = express(),
    fs      = require("fs"),
    parser  = require("body-parser"),
    http    = require('http').Server(app),
    io      = require("socket.io")(http),
    data ={};
    
    app.use(express.static("public"));    
    app.use(parser.urlencoded({extended:true}));
    app.set("view engine","ejs");
    
    
    
    
app.get("*",function (req,res) {
    res.render("home");
});

 

io.on('connection', function(socket){
    
    socket.on('web', function(auth){
      fs.readFile("station", function read(err,data) {
            if(err) {
             return console.log(err);
            }
            if(data){
                var loc = JSON.parse(data)
                socket.emit("station",loc.lat,loc.lon);
            }
        });
    });    
  socket.on('location', function(lat,lan,speed){
      io.emit("loc",lat,lan,speed);
    });
  socket.on('station',function (lat,lon) {
      data.lat = lat;
      data.lon = lon;
      fs.writeFile("station", JSON.stringify(data, null, 2), function(err) {
            if(err) {
             return console.log(err);
            }
        }); 
      io.emit("station",lat,lon);
  });
  socket.on("close",function(distance) {
      io.emit("close",distance);
  });
  socket.on("open",function(distance) {
      io.emit("open",distance);
  });
});

http.listen(process.env.PORT,process.env.IP,function () {
    console.log("Server Strated....");
});