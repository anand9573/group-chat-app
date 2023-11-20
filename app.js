require("dotenv").config()
const fs = require('fs');
const express = require("express")
const bodParser = require("body-parser")
const cors = require("cors")
const AuthenticationRoutes = require("./Routes/AuthRoutes")
const MessagesRouter = require("./routes/Messages")
const GroupRouter = require("./routes/Group")
const PasswordRouter=require('./Routes/password')
const ConnectDB = require("./Util/Database")
const app = express()
const forgotpassword=require('./Models/forgotpassword');
const User = require("./Models/User")
const Messages = require("./Models/Messages")
const Group_Members = require("./Models/GroupMember")
const Group = require("./Models/Group")
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 8080;

const server = http.createServer(app);
const io = socketIO(server); 

// const connectedUsers = new Map(); 
io.on('connection', (socket) => {
  socket.on('custom-event',(number,string,object)=>{
    console.log('socket display is',number,string,object)
  })
  socket.on('send-message',(data)=>{
    console.log('socket display is',data)
   socket.broadcast.emit('receive-message',data)

  })
  function removeSpacesFromFileName(filename) {
    // Replace spaces with underscores
    return filename.replace(/ /g, '_');
  }

  socket.on('file-upload', (fileData,data) => {
    try {      
      console.log('------------------------------------------------------------------------>file uploading')
      const filename =removeSpacesFromFileName(`${fileData.filename}`);
      const fileContent = fileData.content;
      
      // Save the received file to the server
      fs.writeFileSync(`./public/views/uploads/${filename}`, fileContent);
      
      console.log('------------------------------------------------------------------------------------------------------------------------------------------------------------------File saved successfully');
      socket.broadcast.emit('file-received', filename, `http://localhost:3000/uploads/${filename}`, new Date(),data);
    } catch (err) {
      console.error('Error------------------------------------------------------------------------------------------------------------------------:', err);
    }
  });
// })

    // socket.on('login',async (userId) => {
    //     socket.broadcast.emit('userOnline', userId);
    //     connectedUsers[userId]='User Online Now';
    //     socket.emit('onlineUsers', connectedUsers);
    //     const userexist = await User.findByPk(userId);
    //     socket.emit('userexist', userexist);
    //   });
  })
      // socket.on('disconnect', () => {
      //   console.log('dissconnected')
        // for (const [userId, socketId] of connectedUsers) {
          // if (socketId === socket.id) {
          //   connectedUsers.delete(userId); // Remove the user from the map
          //   const currentDate = new Date();
          //   const hours = currentDate.getHours();
          //   const amOrPm = hours >= 12 ? 'PM' : 'AM';
          //   const lastonline = `last seen at ${hours % 12} ${amOrPm}`;
          //   socket.broadcast.emit('userOffline', userId, lastonline); // Notify other clients
// });
      
app.use(express.static('public'));

const corsOptions = {
    origin:['http://127.0.0.1:5500','http://localhost:3000'],
    methods:['GET','POST','DELETE','PUT'],
    credentials:true
}

app.use(cors(corsOptions))
app.use(bodParser.json())

app.use("/user", AuthenticationRoutes)
app.use("/messages", MessagesRouter)
app.use("/group", GroupRouter)
app.use("/password", PasswordRouter)

User.hasMany(forgotpassword);
forgotpassword.belongsTo(User);

User.hasMany(Messages)
Messages.belongsTo(User)
Group.hasMany(Messages)
Messages.belongsTo(Group)

Group.belongsToMany(User, { through: Group_Members })
User.belongsToMany(Group, { through: Group_Members })

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`public/views/${req.url}`))
    })




ConnectDB.sync()
.then(() => {
    server.listen(port, "localhost", () => {
        console.log(`App listening on port ${port}`);
    });
})
.catch(err => console.log(err, "this err from App.js file"))
// // app.use((req, res, next) => {
// //     const requestedPath = path.join(__dirname, 'views', req.url);
// //     // Ensure that only .html files are served
// //     if (path.extname(requestedPath) === '.html') {
// //         // Serve the HTML file
// //         res.sendFile(requestedPath, (err) => {
// //             if (err) {
// //                 // Handle file not found or other errors
// //                 res.status(404).send('File Not Found');
// //             }
// //         });
// //     } else {
// //         // Don't serve non-HTML files
// //         next();
// //     }
// // });