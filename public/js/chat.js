// Store return value in a variable.
// Will be able to send and receive events from the server and the client.
const socket = io();     // Fn is available because of this script being loaded on index.html - "/socket.io/socket.io.js"

// Elements - $ is convention for element from the DOM
const $messageForm =document.querySelector('#message-form');
const $messageFormInput=$messageForm.querySelector('input');
const $messageFormButton=$messageForm.querySelector('button');
const $sendLocationButton=document.querySelector('#send-location');
const $messages=document.querySelector('#messages');
const $sidebar=document.querySelector('#sidebar');
const $allroomslisting=document.querySelector('#all-rooms-listing');

// Templates
const $messageTemplate=document.querySelector('#message-template').innerHTML;     // .innerHTML <= Must have this!
const $locationMessageTemplate=document.querySelector('#location-message-template').innerHTML;
const $sidebarTemplate=document.querySelector('#sidebar-template').innerHTML;
const $allRoomsTemplate=document.querySelector('#all-rooms-template').innerHTML;

// Options
// location.search gives the query string in a web address
// ignoreQueryPrefix ignores the '?' in the query string.
// returns an object with the query string keys as keys.
const {username, room}=Qs.parse(location.search, {ignoreQueryPrefix: true, })   // Query String (qs) parses the query string

const autoscroll=()=>{
  // need new message element to be able to run the calculation
  const $newMessage = $messages.lastElementChild;
  // Get height of new message - including margin, etc.
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom); // extracts number from '16px'
  const newMessageHeight=$newMessage.offsetHeight+newMessageMargin;
  // console.log(newMessageStyles);   // see all styles for that element
  // console.log(newMessageMargin);
  // Visible height
  const visibleHeight = $messages.offsetHeight;
  // Height of messages container
  const containerHeight = $messages.scrollHeight;
  // How far have I scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;   // distance scrolled from top. 0 when right at the top.
  // Were we at bottom BEFORE last message was added.
  if (containerHeight - newMessageHeight<= scrollOffset){  // Condition for when we should scroll to the bottom.
    $messages.scrollTop = $messages.scrollHeight  // Code to scroll to the bottom
  }
}

// Note - "message" event is received twice with different messages from server.
socket.on('message',(message)=>{    // Receives from server.
  console.log(message);   // Message is now an object.
  // Need access to template and place where we are going to put it.
  // const html = Mustache.render($messageTemplate);     // Stores html to be rendered in the browser. Template is the only argument.
  const html = Mustache.render($messageTemplate,{
    username: message.username,
    message: message.text,            // message: message
    createdAt: moment(message.createdAt).utc().format('dddd Do MMMM YYYY, HH:mm'),
  });   // Data being passed is done using an object (with key value pairs) as the 2nd argument.
  $messages.insertAdjacentHTML('beforeend', html);     // Insert 'beforeend' - just before element ends so new items at the top.
  autoscroll();
})

// Separate code so we can run a different template.
socket.on('locationMessage',(message)=>{
  console.log(message);
   const html = Mustache.render($locationMessageTemplate,{
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).utc().format('dddd Do MMMM YYYY, HH:mm'),
  })
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
})

socket.on('roomData',({room, users})=>{
  console.log('roomData=>',room, users);
  const html = Mustache.render($sidebarTemplate,{
    room,
    users,
  })
  $sidebar.innerHTML=html;
})

// gb addition
socket.on('globalData',({rooms})=>{
  console.log('globalData=>',rooms);
  const html = Mustache.render($allRoomsTemplate,{
    rooms,      // gb addition
  })
  $allroomslisting.innerHTML=html;
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

// socket.emit('join',{ username, room}); 
// Acknowledgment function added as final argument to emit
socket.emit('join',{ username, room},(error)=>{
  if (error){
    alert(error);
    location.href='/';  // Redirect to root of site - join page.
  }
}); 