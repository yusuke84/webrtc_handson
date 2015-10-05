var rooms = {};

var server = require('http').createServer()
    , url = require('url')
    , WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ server: server })
    , express = require('express')
    , app = express()
    , port = 9001;

app.use(function (req, res) {
    res.send({ msg: 'hello' });
});

wss.on('connection', function connection(ws) {

    var apikey = ws.upgradeReq.url.slice(1);
    console.log('connected new client into ' + apikey);

    if(!!rooms[apikey] === false){
        rooms[apikey] = {'peers':[ws]};
        console.log('create ' + apikey + ' room');
    }else if(rooms[apikey].peers.length < 2) {
        rooms[apikey]['peers'].push(ws);
        console.log('join in room');
    }else{
        console.log('room is full');
        ws.close();
    }

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        rooms[apikey].peers.forEach(function(cli){
            if(ws != cli){
                cli.send(message);
            }
        });
    });

    ws.on('close', function(){
        var idx = rooms[apikey].peers.hasOwnProperty(ws);
        if(idx !== -1) {
            console.log('connection terminated for %d', idx);
            rooms[apikey].peers.splice(idx, 1);
        }

    });

});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });
