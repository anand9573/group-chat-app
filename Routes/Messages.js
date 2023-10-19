const express = require("express")

const MessagesRouter = express.Router()
const Middleware=require('../middleware/authenticate')

const MessagesController = require("../Controllers/Messages")

MessagesRouter.post("/sent_to/:send_to",Middleware.authentication, MessagesController.postMesssages)
MessagesRouter.get("/:userId/:user2Id",Middleware.authentication, MessagesController.getOneToOneMessages)
MessagesRouter.get("/:groupId",Middleware.authentication, MessagesController.getGroupMessages)
module.exports = MessagesRouter  
