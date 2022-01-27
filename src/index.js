const express=require('express');
const app=express();
const path=require('path');
const publicDirectoryPath = path.join(__dirname, '../public');
const port=process.env.PORT || 3000;
app.use(express.static(publicDirectoryPath));   // Serves up contents of this 'public' folder

// app.get('/', (req, res)=>{
// //  res.send("CONTACT IS MADE!!!");
// // Code below is the equivalent of "app.use(express.static(publicDirectoryPath));"
//   // res.sendFile('index.html', {
//   //   root: publicDirectoryPath
//   // })
// })


app.listen(port,()=>{
  console.log("Chat App is listening on port "+port+" "+"http://localhost:3000/");
})