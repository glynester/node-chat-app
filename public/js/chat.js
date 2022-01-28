// Store return value in a variable.
// Will be able to send and receive events from the server and the client.
const socket = io();     // Fn is available because of this script being loaded on index.html - "/socket.io/socket.io.js"

// Note - "message" event is received twice with different messages from server.
socket.on('message',(message)=>{    // Receives from server.
  console.log(message);
})

// document.querySelector('form').addEventListener('submit',(e)=>{
  document.querySelector('#message-form').addEventListener('submit',(e)=>{
  e.preventDefault();   // Stops browser refreshing with form submit
  // const message = document.querySelector('input').value;
  // Another way to access the input value is from the "e" object.
  // "e" has "target" property which is the target we're listening for the event on which is the form, so e.target in this case is the form.
  // const message = e.target.message.value;  // This also works
  const message = e.target.elements.message.value;
  // console.log("Button clicked and msg is "+messageToServer);
  socket.emit('sendMessage', message);    // Sends to server.
});

