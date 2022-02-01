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
addUser({
  id: 22,
  username: '    Glenn     ',
  room: '   Sporty Room    '
});

console.log(users);

const res = 
addUser({
  id: 33,
  username: '         ',
  room: '       '
});
console.log(res);

const res2 = 
addUser({
  id: 22,
  username: 'Glenn',
  room: 'Sporty Room'
});
console.log(res2);

const removedUser = removeUser(22);
console.log(removedUser);
console.log(users);