const UserDB = require("../Models/User")
const GroupDB = require("../Models/Group")
const Group_Members = require("../Models/GroupMember")
const { Op } = require("sequelize");
const sequelize=require('../Util/Database')
const bcrypt = require("bcrypt")
const saltround = 10
const generateAccessToken = require("../Util/JWT");

function isinvalid(string){
    if(string===undefined || string.length===0){
        return true
    }
    return false
}

exports.postSignUp = async (req, res, next) => {
let t=await sequelize.transaction();
    const { Name, Email, Mobile, Password } = req.body
    try {
        if(isinvalid(Name) || isinvalid(Email) || isinvalid(Mobile) || isinvalid(Password)){
            res.status(403).json({message:'user details are not valid please fill all neccessary fields',success:true});
        }else{
        const existUser = await UserDB.findOne({ where: { [Op.or]: [{ email: Email }, { mobile: Mobile }] } })
        if (existUser) {
            res.status(409).json({message:'* Email already exist please login!',success:false})
        } else {
            bcrypt.hash(Password, saltround, async (err, hash) => {
                if (err) {
                    throw new Error("Something Went Wrong")
                } else {
                    await UserDB.create({
                        Name: Name,
                        email: Email,
                        mobile: Mobile,
                        password: hash
                    },{transaction:t})
                    await t.commit();
                    res.status(201).json({ message: "Registeration done Successfully", status: true })
                }
            })
        }
    }
    } catch (err) {
        if (t) {
            await t.rollback();
        }
        res.status(500).json({ message: "something went wrong please register after sometime!" })
    }
}

exports.postLogin = async (req, res, next) => {
    const { Email, Password } = req.body
    try {
        if( isinvalid(Email) || isinvalid(Password)){
            res.status(403).json({message:'user details are not valid please fill all neccessary fields',success:true});
        }else{
        const ExistUser = await UserDB.findOne({ where: { Email } })
        if (!ExistUser) {
            res.status(404).json({ message: "User Not Exist", success: false })
        } else {
            const hash = ExistUser.password
            bcrypt.compare(Password, hash, (err, result) => {
                if (err) {
                    throw new Error({ message: "Somthing Went Worng" })
                } if (result) {
                    res.status(201).json({ message: "Successfully Login", userID: ExistUser.id, tokenID: generateAccessToken(ExistUser.id, ExistUser.email,ExistUser.Name) })
                } else {
                    res.status(401).json({ message: "Incorrect Password", success: false })
                }
            })
        }
    }
    } catch (err) {
        console.log(err, "from login route")
        res.status(500).json({ message: "Error Occurred while Login", error: err.message })
    }
}

exports.getUsers = async (req, res, next) => {
    const userid = req.params.userid
    try {
        const user = await UserDB.findByPk(userid, {
            attributes: ["id", "Name", "email", "mobile"],
            include: {
                attributes: ["id", "Name"],
                model: GroupDB,
                through: {
                    model: Group_Members,
                    attributes: ["id", "admin"]
                }
            }
        }
        )
        const users = await UserDB.findAll(
            {
                where: { [Op.not]: { id: userid } },
                attributes: ["id", "Name", "email", "mobile"]
            }
        )
        res.status(200).json({ userDetails: user, allUsers: users })
    } catch (err) {
        console.log(err, "form getUser")
        res.status(500).json({ message: "Somthing Went Wrong" })
    }
}

exports.searchuser=async(req,res,next)=>{
    try{
        const { search, groupid } = req.query;
        const groupUserIds = await Group_Members.findAll({
          where: {
            groupId: groupid,
          },
          attributes: ["userId"],
        });
        
        const groupUserIdsArray = groupUserIds.map(groupUser => groupUser.userId);
        
        const NongroupMembers = await UserDB.findAll({
          attributes: ["id", "Name", "email", "mobile"],
          include: [
            {
              model: GroupDB,
              through: {
                model: Group_Members,
                attributes: ["id", "UserId", "admin"],
              },
              attributes: ["id", "Name"],
              required: false,
            },
          ],
          where: {
            [Op.or]: [
              { Name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
              { mobile: { [Op.like]: `%${search}%` } },
            ],
            id: {
              [Op.notIn]: groupUserIdsArray,
            },
          },
        });
res.status(201).json({search:NongroupMembers,success:true})
}catch(err){
    res.status(500).json({message:'something went wrong in searching user',success:false})

}
}