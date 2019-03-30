const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const server = app.listen(process.env.PORT || 8080);
let io = require('socket.io')(server);
let doc = {
  state: ''
};
let numClients = 0;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log('Server is now listening on port 8080.');

io.sockets.on('connection', console.log);

function connection(client) {
  console.log('A new user with id ' + client.id + ' has entered.');
  numClients++;

  client.emit('newUser', doc.state);

  client.on('userEdit', handleTextSent);

  function handleTextSent(data) {
    client.broadcast.emit('receiveEdit', data.change);
    doc.state = data.currentState;
  }

  client.on('disconnect', function () {
    console.log('Client with id ' + client.id + ' has disconnected.');
    numClients--;
  });
}
