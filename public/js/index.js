// files created by gb

// const { getRooms } = require('../../src/utils/users');

const socket = io();  

// elements
const $roomsList=document.querySelector('#rooms-list');

// templates
const $roomsDropdownTemplate=document.querySelector('#rooms-dropdown-template').innerHTML;

// [ { room: '456', number: 0 } ]
socket.on('globalData',({rooms})=>{
  console.log("globalData=>", rooms);
  const html=Mustache.render($roomsDropdownTemplate,{
    rooms,
  })
  console.log('$roomsList=>',$roomsList);
  console.log('html=>',html);
  $roomsList.innerHTML = html;
})

function addRoomsDropdown(){
  socket.emit('updateRoomsForLoginScreen',()=>{
    console.log('updateRoomsForLoginScreen emitted by client')
  })
}
