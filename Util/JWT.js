const jwt = require("jsonwebtoken")

const jwt_key= process.env.JWT_KEY

function generateAccessToken(id, name){
    return jwt.sign({id:id, name:name}, process.env.TOKEN_SECRET)
}

module.exports = generateAccessToken