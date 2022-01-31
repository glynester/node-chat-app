// Store return value in a variable.
// Will be able to send and receive events from the server and the client.
const socket = io();     // Fn is available because of this script being loaded on index.html - "/socket.io/socket.io.js"

// Elements - $ is convention for element from the DOM
const $messageForm =document.querySelector('#message-form');
const $messageFormInput=$messageForm.querySelector('input');
const $messageFormButton=$messageForm.querySelector('button');
const $sendLocationButton=document.querySelector('#send-location');
const $messages=document.querySelector('#messages');

// Templates
const $messageTemplate=document.querySelector('#message-template').innerHTML;     // .innerHTML

// Note - "message" event is received twice with different messages from server.
socket.on('message',(message)=>{    // Receives from server.
  console.log(message);
  // Need access to template and place where we are going to put it.
  // const html = Mustache.render($messageTemplate);     // Stores html to be rendered in the browser. Template is the only argument.
  const html = Mustache.render($messageTemplate,{
    message,            // message: message
  });   // Data being passed is done using an object (with key value pairs) as the 2nd argument.
  $messages.insertAdjacentHTML('beforeend',html);     // Insert 'beforeend' - just before element ends so new items at the top.
})

// document.querySelector('form').addEventListener('submit',(e)=>{
  $messageForm.addEventListener('submit',(e)=>{
  e.preventDefault();   // Stops browser refreshing with form submit
  // Disable form submit button while processing
  $messageFormButton.setAttribute('disabled',true) ;
  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message,(error)=>{
    // Re-enable form submit button
    // $messageFormButton.disabled=false;   // Also works!
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value='';
    $messageFormInput.focus();
    if (error){
      return console.log(error);
    }
    console.log("Message delivered!!!");
  });  
});

$sendLocationButton.addEventListener('click',()=>{
  // Modern browsers should have this.
  if (!navigator.geolocation){
    return alert("Your browser doesn't support geolocation!!!");
  }
  // Disable button while processing
  // $sendLocationButton.enabled=false;
  $sendLocationButton.setAttribute('disabled',true);

  // getCurrentPosition is asynchronous but doesn't support promises or async await. Have to use callback
  navigator.geolocation.getCurrentPosition((position)=>{
    // console.log(position);
    // This didn't work when I just sent position back to the server.
    socket.emit('sendLocation', {   // first argument is event name, then location data and thrid arg is acknowledgement callback.
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },()=>{     // callback function.
      // Re enable button while processing // $sendLocationButton.disabled=false; also works
      $sendLocationButton.removeAttribute('disabled');
      console.log("Location Shared!!!");
    });
  })
  
})
