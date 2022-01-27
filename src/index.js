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

// server (emit) --> client(receive) - 'countUpdated'
// client (emit) --> server(receive) - 'increment'
// The custom event names (countUpdated + increment) must be the same on index.js as they are on chat.js

let count=0;
// listening for a given event to occur - "connection" (std event - not custom) and fn to run when that event occurs.
// io.on('connection',()=>{ // socket is an object that contains info about the new connection. We can use methods on this to communicate with that client.
  io.on('connection',(socket)=>{
  console.log('New WebSocket connection');  // Sends msg to terminal wehn given client connects
  // 2nd argument ('count' here) is available on client (chat.js) callback.
  // No need to send this to all clients - just one who has connected
  socket.emit('countUpdated', count);  // Sending and receiving events. Send (custom) event to client who has just onnected.
  socket.on('increment',()=>{
    count++;  // Just receiving the event is enough for us to increment the count - no reason to receive data also in this case.
    // socket.emit('countUpdated', count); // 'socket.emit' only emits to a single specific connection.
    io.emit('countUpdated', count); // 'io.emit' emits to EVERY connection! In this case when one user clicks, we want all users to see the updated count value.
  });
})

// app.listen(port,()=>{
server.listen(port,()=>{
  console.log("Chat App is listening on port "+port+" "+"http://localhost:3000/");
})