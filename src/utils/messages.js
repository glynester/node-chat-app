const generateMessage=(username, text)=>{
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  }
}

// const generateLocationMessage=(url)=>{
const generateLocationMessage=(username, url)=>{  // Now have to change how we call generateLocationMessage.
  return {
    username,
    url,
    createdAt: new Date().getTime(),
  }
}

module.exports={
  generateMessage,
  generateLocationMessage,
}