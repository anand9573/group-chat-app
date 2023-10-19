const express = require("express")

const GroupRoutes = express.Router();

const Middleware=require('../middleware/authenticate')

const groupController = require("../Controllers/Group")

GroupRoutes.post("/:userId",Middleware.authentication, groupController.postCreateGroup)
GroupRoutes.get("/:groupId",Middleware.authentication, groupController.getGroupMembers)
GroupRoutes.post("/admin/:userId",Middleware.authentication,  groupController.postMakeAdmin)
GroupRoutes.post("/admin/remove/:userId",Middleware.authentication, groupController.postRemoveAsAdmin)
GroupRoutes.post("/exit/:userId",Middleware.authentication, groupController.removeUserFromGroup)
GroupRoutes.post("/addmembers/:userId",Middleware.authentication, groupController.postUserToExistGroup);


module.exports = GroupRoutes