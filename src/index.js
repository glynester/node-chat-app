const path=require('path'); // express core module
const http=require('http'); // express core module
const express=require('express');
const socketio=require('socket.io');

const app=express();
const server = http.createServer(app); // creates new webserver. Ordinarily this is automatically done but we specifically need to access this server variable for setting up socketio.
// socket io must be called with raw http server.
const io=socketio(server); // create new instance of socket.io to configure websockets to work with our server

const publicDirectoryPath = path.join(__dirname, '../public');
const port=process.env.PORT || 3000;
app.use(express.static(publicDirectoryPath));   // SERVES up contents of this 'public' folder so we can access any file in this folder, e.g. test.html is accessible from localhost:3000/test.html (index.html is available from just 'localhost:3000/' by default)
// Main built in event = 'connection'
io.on('connection',(socket)=>{
  console.log("New Web Socket Connection!!!");
  socket.emit('message',"Welcome to my realtime messaging app");   // Sends msg to terminal when given client connects
  
  // Like io.emit except it excludes the person (socket) who has just connected.
  socket.broadcast.emit('message', "A new user has joined!!!");
  
  socket.on('sendMessage', (message)=>{ // When server receives a message from one socket, send it to all sockets (with io.emit)
    console.log(message);
    io.emit('message', message); // Sent to all sockets.
  })
// Client has already disconnected so no chance that they will get the message so can still use io.emit
// Disconnect is a standard event handled by socket.io library.
socket.on("disconnect", ()=>{
  io.emit('message', "User has disconnected!!!");
})

})
// Note - "message" event is emitted twice from server (see above) with different messages.

// app.listen(port,()=>{
server.listen(port,()=>{
  console.log("Chat App is listening on port "+port+" "+"http://localhost:3000/");
})