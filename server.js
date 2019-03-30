const express = require('express');
const app = express();
const path = require('path');
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

io.on('connection', connection);

function connection(client) {
  console.log('A new user with id ' + client.id + ' has entered.');
  numClients++;


  if (doc.state) {
    client.emit('newUser', doc.state);
  }
  
  client.on('userEdit', handleTextSent);

  function handleTextSent(content) {
    client.broadcast.emit('receiveEdit', content);
    doc.state = content;
  }

  client.on('disconnect', function () {
    console.log('Client with id ' + client.id + ' has disconnected.');
    numClients--;
  });
}
