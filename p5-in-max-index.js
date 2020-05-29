//initialize express server
var express = require("express");
var app = express();
const server = require("http").createServer(app);

const Max = require("max-api");
var io = require("socket.io")(server);

app.use(express.static("public"));

//recieve a 'bang' message from Max and send a trigger to client
Max.addHandler('bang', () => {
	Max.post('bang');
	io.emit('beat', 'heyo')
});

//recieve slider value and array of midi notes from client
//and outlet to Max
io.on('connection', (socket) => {
	socket.on('note', (data) => {
		Max.outlet(data);
	});
	socket.on('report', (data) => {
		console.log(data);
	});
});


server.listen(3000);
