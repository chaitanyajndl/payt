var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var port = 3000;

var Drivers = {};

app.use(express.static(__dirname + '/bower_components'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

server.listen(port); 

io.on('connection', function(client) {  
    console.log('Client connected...');
    client.on('disconnect',function(){
        console.log('Client Disconnected...');
    });

    client.on('addDriver',function(driverData){
        if(driverData.isset){
            Drivers[driverData.name] = client;
        }
    });

    var Ride = {};

    var SortDrivers = {};
    var Rides = {};

    client.on('requestRide',function(riderData){
        Rides[riderData.name] = client;
        var i = 0;
       // Ride = setInterval(function(){
            makearider(Drivers,riderData);

        //},10000)
    });

    function makearider(Drivers,riderData){
        console.log(SortDrivers);

        SortDrivers = Drivers;
        for(d in SortDrivers){
            SortDrivers[d].emit('make a ride',riderData);
            return false;
        }
    }

    client.on('on time out',function(rideData,DriverData){
        SortDrivers = Drivers;
        delete SortDrivers[DriverData.name];
        makearider(SortDrivers,rideData);
    })

    client.on('cancelRide',function(){
        //clearInterval(Ride);
        client.broadcast.emit('stop a ride',{message:'user clanced ride'});
    });

    client.on('acceptRide',function(DriverData){
        //for(r in Rides){
            client.broadcast.emit('you got ride',DriverData);
        //    return false;
       // }
    })

    
    
});