const path=require('path'); // express core module
const http=require('http'); // express core module
const express=require('express');
const socketio=require('socket.io');

const app=express();
const server = http.createServer(app); // creates new webserver. Orinarily this is automatically done but we specifically need to access this server variable
// socket io must be called with raw http server.
const io=socketio(server); // create new instance of socket.io to configure websockets to work with our server

const publicDirectoryPath = path.join(__dirname, '../public');
const port=process.env.PORT || 3000;
app.use(express.static(publicDirectoryPath));   // Serves up contents of this 'public' folder

// server (emit) --> client(receive) - countUpdated
// client (emit) --> server(receive) - increment

let count=0;
// listening for a given event to occur - "connection" and fn to run when that event occurs.
// io.on('connection',()=>{ // socket is an object that contains info about the new connection. We can use methods on this to communicate with that client.
  io.on('connection',(socket)=>{
  console.log('New WebSocket connection');  // Sends msg to terminal wehn given client connects
  // 2nd argument is available on client (chat.js) callback.
  // No need to send this to all clients - just one who has connected
  socket.emit('countUpdated', count);  // Sending and receiving events. Send (custom) event to client.
  socket.on('increment',()=>{
    count++;
    // socket.emit('countUpdated', count); // Only emits to a single specific connection.
    io.emit('countUpdated', count); // emits to EVERY connection!
  });
})

// app.listen(port,()=>{
server.listen(port,()=>{
  console.log("Chat App is listening on port "+port+" "+"http://localhost:3000/");
})