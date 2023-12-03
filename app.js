require("dotenv").config()
const fs = require('fs');
const express = require("express")
const bodParser = require("body-parser")
const cors = require("cors")
const AuthenticationRoutes = require("./Routes/AuthRoutes");
const sequelize=require('./Util/Database')
const MessagesRouter = require("./routes/Messages")
const GroupRouter = require("./routes/Group")
const PasswordRouter=require('./Routes/password')
const ConnectDB = require("./Util/Database")
const app = express()
const forgotpassword=require('./Models/forgotpassword');
const User = require("./Models/User")
const Messages = require("./Models/Messages")
const Group_Members = require("./Models/GroupMember");
const AchivedChat=require('./Models/archivedchats');
const Group = require("./Models/Group")
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const cron = require('node-cron');

const port = process.env.PORT || 8080;

const server = http.createServer(app);
const io = socketIO(server); 
const Op  = require('sequelize');
const { group } = require("console");

io.on('connection', (socket) => {
  socket.on('setUserId', (userId) => {
    console.log(`User with ID ${userId} connected`);
    // Store the user ID in a data structure or associate it with the socket
    socket.userId = userId;
  });
  socket.on('token',async(token)=>{
    const user = await User.findByPk(token.id)
    if(user){
      socket.emit('verified',true)
      await User.update(
        { lastonline: 'online now' },
        {
          where: {
            id:token.id
          }
        }
        )
    }else{
      socket.emit('verified',false)
    }
  })
  socket.on('lastonline',async(userid)=>{
    const user=await User.findByPk(userid);
    if(user){
      socket.emit('onlineat',userid,user.lastonline)
  }

  });
  socket.on('send-message',(data)=>{
    console.log('socket display is',data)
   socket.broadcast.emit('receive-message',data)

  });
  socket.on('group-created',(groupname)=>{
   socket.emit('receive-groupname',groupname);
   socket.broadcast.emit('receive-groupmsg',groupname);

  });

  cron.schedule('* 20 1 * * *', async () => {
    console.log('code is running in cron')
    const currentTimestamp = new Date();
    currentTimestamp.setHours(currentTimestamp.getHours() - 24);
    const chat = await Messages.findAll({ where: { time_stamp: { [Op.lt]: currentTimestamp } } })

    chat.forEach(async chat => {
        await AchivedChat.create({ sent_to:chat.sent_to, message:chat.message, file:chat.file, url:chat.url, time_stamp:chat.time_stamp,createdAt:chat.createdAt, updatedAt:chat.updatedAt, userId:chat.userId, groupId:chat.groupId,sentby:chat.sent_by })

    await Messages.destroy({ where: { createdAt: { [Op.lt]: currentTimestamp } } })
});
});


  function removeSpacesFromFileName(filename) {
    return filename.replace(/ /g, '_');
  }

  socket.on('file-upload', (fileData,data) => {
    try {      
      console.log('----->file uploading')
      const filename =removeSpacesFromFileName(`${fileData.filename}`);
      const fileContent = fileData.content;
      
      // Save the received file to the server
      fs.writeFileSync(`./public/views/uploads/${filename}`, fileContent);
      console.log('-----File saved successfully');
      socket.broadcast.emit('file-received', filename, `http://localhost:3000/uploads/${filename}`, new Date(),data);
    } catch (err) {
      console.error('Error-----:', err);
    }
  });
  const connectedUsers=[]
  socket.on('login',async (userId) => {
    socket.broadcast.emit('userOnline', userId);
    connectedUsers[userId]='Online Now';
    socket.emit('onlineUsers', connectedUsers);
  });
  socket.on('disconnect', async() => {
          console.log('disconnected',socket.userId);
              const currentDate = new Date();
              const hours = currentDate.getHours();
              const minutes = currentDate.getMinutes();
              const amOrPm = hours >= 12 ? 'pm' : 'am';
              const formattedMinutes = String(minutes).padStart(2, '0');
              const formattedHours = (hours % 12 === 0) ? 12 : hours % 12;
              const lastonline = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
              try{
                
                const user=await User.update(
                  { lastonline: lastonline },
                  {
                    where: {
                      id:socket.userId
                    }
                  })
                  
                }catch(err){
                  console.log(err)

                }
                // socket.emit('userOffline',userId, lastonline);
                
              })
              
              //       }
              //     }catch(err){
        //       if(t){
          //         await t.rollback()
          //       }
          //       console.log(err)
          //     }
          //   });
          
          // })
        })
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