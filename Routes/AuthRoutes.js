const express = require("express")

const AuthRouter = express.Router();

const Middleware=require('../middleware/authenticate')

const AuthControls = require("../Controllers/Authentication")

AuthRouter.post("/signup", AuthControls.postSignUp)
AuthRouter.post("/login", AuthControls.postLogin)
AuthRouter.get("/getusers/:userid",Middleware.authentication, AuthControls.getUsers)
AuthRouter.get("/search",Middleware.authentication, AuthControls.searchuser)

module.exports= AuthRouter