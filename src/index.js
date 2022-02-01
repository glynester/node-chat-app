const path=require('path'); // express core module
const http=require('http'); // express core module
const express=require('express');
const socketio=require('socket.io');
const Filter=require('bad-words');
const { generateMessage, generateLocationMessage }=require('./utils/messages.js');
const { addUser, removeUser, getUser, getUsersInRoom, } = require('./utils/users.js')

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
  // socket.emit('message',"Welcome to my realtime messaging app");   // Sends msg to terminal when given client connects
  // socket.emit('message',{
  //   text: "Welcome to my realtime messaging app",
  //   createdAt: new Date().getTime(),
  // });   // Sends msg to terminal when given client connects
  // socket.emit('message', generateMessage("Welcome to my realtime messaging app"));

  // // Like io.emit except it excludes the person (socket) who has just connected.
  // socket.broadcast.emit('message', generateMessage("A new user has joined!!!"));
  
  // socket.on('join',({username, room})=>{
    // socket.on('join',({username, room},callback)=>{
    // const { error, user } = addUser({ id:socket.id, username, room });  // socket.id is unique ID for that particular connection.
    socket.on('join',(options,callback)=>{ // These 2 lines are effectively the same as 2 commented lines above
      const { error, user } = addUser({ id:socket.id, ...options }); 
    if (error){
      // return socket.emit('message',generateMessage(error));
      return callback(error);
    }
    // 'user.room' has been sanitized unlike 'room'
    socket.join(user.room);    // .join - creates chatroom. 
    // io.to.emit => will only go to people in that room
    // socket.broadcast.to.emit => goes to everyone in that room except that user (client)
    socket.emit('message', generateMessage("Admin", "Welcome to my realtime messaging app"));
    socket.broadcast.to(user.room).emit('message', generateMessage("Admin", `${user.username} has joined!!!`));
    callback(); // Calling without args, i.e. no error.
  })


  // socket.on('sendMessage', (message)=>{ // When server receives a message from one socket, send it to all sockets (with io.emit)
  // Add callback for the acknowledgement
  socket.on('sendMessage', (message, callback)=>{   // Callback runs code for the acknowledgement
    const filter = new Filter();
    const user = getUser(socket.id);
    if (filter.isProfane(message)){
      return callback('Profanity is not allowed!!!');
    }
    // 'Free Room' - Temporarily hard wired!
    io.to(user.room).emit('message', generateMessage(user.username, message)); // Sent to all sockets.
    // callback("Server received this!!!");      // Can add as many args here as you want. Callback called by receiver.
    callback();
  })
// Client has already disconnected so no chance that they will get the message so can still use io.emit
// Disconnect is a standard event handled by socket.io library.
socket.on("disconnect", ()=>{
  const user = removeUser(socket.id);
  if (user){    // User might have never successfully joined a chat room. If they didn't then no need to send them this message.
    // io.emit('message', generateMessage("User has disconnected!!!"));
    io.to(user.room).emit('message', generateMessage("Admin", `${user.username} has disconnected!!!`));
  }
})

socket.on('sendLocation',(coords, callback)=>{
  const user = getUser(socket.id);
  console.log("position: ",coords)
  // io.emit('message',`New user has joined with latitude: ${coords.latitude} and longitude: ${coords.longitude}.`);
  io.to(user.room).emit('locationMessage',generateLocationMessage(user.username, `https://google.com/maps/?q=${coords.latitude},${coords.longitude}`));
  callback(); // callback runs once location has been shared. No need to pass an argument.
})

})
// Note - "message" event is emitted twice from server (see above) with different messages.

// app.listen(port,()=>{
server.listen(port,()=>{
  console.log("Chat App is listening on port "+port+" "+"http://localhost:3000/");
})