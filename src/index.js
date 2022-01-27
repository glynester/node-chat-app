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

// listening for a given event to occur - "connection" and fn to run when that event occurs.
io.on('connection',()=>{
  console.log('New WebSocket connection');  // Sends msg to terminal wehn given client connects
})

// app.listen(port,()=>{
server.listen(port,()=>{
  console.log("Chat App is listening on port "+port+" "+"http://localhost:3000/");
})