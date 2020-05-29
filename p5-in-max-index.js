var express = require("express");
var app = express();
const server = require("http").createServer(app);
const readline = require("readline");
const Max = require("max-api");
var io = require("socket.io")(server);

app.use(express.static("public"));

Max.addHandler('bang', () => {
	Max.post('bang');
	io.emit('beat', 'heyo')
});

io.on('connection', (socket) => {
	socket.on('note', (data) => {
		Max.outlet(data);
	});
	socket.on('report', (data) => {
		console.log(data);
	});
});


server.listen(3000);
