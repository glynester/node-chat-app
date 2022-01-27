//Store return value in a variable.
// Will be able to send and receive events from the server and the client.
const socket = io();     // Fn is available because of this script being loaded on index.html - "/socket.io/socket.io.js"


// receive event
socket.on('countUpdated', (count)=>{
  // 2nd argument on index.js (socket.emit) is first argument here
  console.log('The count has been updated ', count);

})

document.querySelector('#increment').addEventListener('click',()=>{
  console.log('clicked!!!');
  socket.emit('increment');   // emitted from client.
});


