const users=[];

// addUser, removeUser, getUser, getUsersInRoom
const addUser =({ id, username, room })=>{
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  // Validate the data
  if (!username || !room){
    return {
      error: 'Username and room are required!'
    }
  }
  // Check for existing user
  const existingUser = users.find((user)=>{
    return user.room === room && user.username === username
  })
  // Validate username
  if (existingUser){
    return {
      error: 'Username is already in use!'
    }
  }
  // Store user
  const user = { id, username, room }
  users.push(user);
  return { user }
}

const removeUser=(id)=>{
  const index = users.findIndex((user)=>user.id === id);
  if (index!==-1){
    return users.splice(index,1)[0]; // Faster than filter removal method - will stop searching once match is found.
  }
}

const getUser=(id)=>{
  return users.find(user=>user.id === id);
}

const getUsersInRoom=(room)=>{
  // No need to sanitize room as coming from server.
  return users.filter(user=>user.room===room);
}
const clearRooms=()=>{
  rooms=[];
}

//  gb addition
const rooms=[];     // ({ id:socket.id, username, room }) // ['NEW ROOM': [ { id: 'Rnzb8oImnGdFOwO-AAAT', username: 'testy', room: 'NEW ROOM' }]]
//  gb addition
const addToRooms=({id, username, room})=>{
  const ind = rooms.findIndex(r=>r.room==room);
  let usersRoom;
  if (ind>=0){ usersRoom = rooms[ind]}
  console.log("usersRoom->addToRooms",usersRoom, ind);
  if (!usersRoom){ 
    rooms.push({room, users:[{username, id}]});
  } else if (!usersRoom.users.some(v=>v.username==username)) { 
    rooms[ind].users.push({username, id}); 
  }
  // console.log("addToRooms called!",room);
  console.log("Current rooms",JSON.stringify(rooms));
  // getRooms();
}

//  gb addition
const removeFromRooms=({id, username, room})=>{
  const ind = rooms.findIndex(r=>r.room==room);
  let usersRoom;
  if (ind>=0){ usersRoom = rooms[ind]}
  console.log("usersRoom->removeFromRooms",usersRoom, ind);
  if (usersRoom){ 
    rooms[ind].users.splice(rooms[ind].users.findIndex(v=>v.username==username),1);
  }
  // console.log("removeFromRooms called!",room);
  console.log("Current rooms",JSON.stringify(rooms));
  // getRooms();
}

// gb addition
const getRooms=()=>{
  // console.log("getRooms - rooms",rooms);
  const summary=[];
  rooms.forEach(r=>{
    console.log("room=>",r)
    summary.push({room:r.room, number: r.users.length});
  })
  console.log("getRooms called! - no parameters",summary);
  return summary;   // [ { room: 'free room', number: 2 }, { room: 'xroom', number: 1 }]
}

module.exports= {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addToRooms,  // gb addition
  removeFromRooms,  // gb addition
  getRooms,   // gb addition
}

// addUser({
//   id: 22,
//   username: '    Glenn     ',
//   room: '   Sporty Room    '
// });
// console.log(users);

// addUser({
//   id: 42,
//   username: 'Boo',
//   room: 'Sporty Room'
// });

// addUser({
//   id: 32,
//   username: 'Freddi',
//   room: 'Geeky Room'
// });

// const res = 
// addUser({
//   id: 33,
//   username: '         ',
//   room: '       '
// });
// console.log(res);

// const res2 = 
// addUser({
//   id: 22,
//   username: 'Glenn',
//   room: 'Sporty Room'
// });
// console.log(res2);

// // const removedUser = removeUser(22);
// // console.log("removedUser",removedUser);
// // console.log("users",users);

// console.log("getUser(42)",getUser(42));
// console.log("getUser(999)",getUser(999));
// console.log("users",users);
// console.log("getUsersInRoom=>",getUsersInRoom('sporty room'));
// console.log("getUsersInRoom=>",getUsersInRoom('geeky room'));

