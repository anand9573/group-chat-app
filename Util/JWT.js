const jwt = require("jsonwebtoken")

const jwt_key= process.env.JWT_KEY

function generateAccessToken(id,Email, Name){
    return jwt.sign({id,Email, Name}, process.env.TOKEN_SECRET)
}
module.exports = generateAccessToken