// files created by gb

const socket = io();  

// elements
const $roomInput=document.querySelector('#room-input');

// templates
const $roomsDropdownTemplate=document.querySelector('#rooms-dropdown-template');

socket.on('globalData',({rooms})=>{
  // const {room, number}=rooms;   // [ { room: '456', number: 0 } ]
  // console.log("room, number=>", room, number);
  console.log("rooms=>", rooms);
  // const html=Mustache.render($roomsDropdownTemplate,{
  //   // room,
  //   // number,
  //   rooms,
  // })
  // $roomInput.appendChild(html);
})