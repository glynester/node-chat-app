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
  // socket.emit('sendMessage', message);    // Sends to server.
  // Data can be any number of args but last function is the acknowledgement (from server in this case). Need to change server code too.
  // socket.emit('sendMessage', message,(servMsg)=>{
  //   console.log("The message was delivered",servMsg);
  // });    // Sends to server.
  socket.emit('sendMessage', message,(error)=>{
    if (error){
      return console.log(error);
    }
    console.log("Message delivered!!!");
  });    // Se
});

document.querySelector('#send-location').addEventListener('click',()=>{
  // Modern browsers should have this.
  if (!navigator.geolocation){
    return alert("Your browser doesn't support geolocation!!!");
  }
  // getCurrentPosition is asynchronous but doesn't support promises or async await. Have to use callback
  navigator.geolocation.getCurrentPosition((position)=>{
    // console.log(position);
    // This didn't work when I just sent position back to the server.
    socket.emit('sendLocation', {   // first argument is event name, then location data and thrid arg is acknowledgement callback.
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },()=>{     // callback function.
      console.log("Location Shared!!!");
    });
  })
  
})
