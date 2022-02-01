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

module.exports= {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
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

