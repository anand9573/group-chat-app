const MessagesDB = require("../Models/Messages")
const GroupMembersDB = require("../Models/GroupMember")
const sequelize=require('../Util/Database')
const GroupDB = require("../Models/Group")
const UserDB = require("../Models/User")
const { Op } = require("sequelize")
const group_members = require("../Models/GroupMember")

exports.postCreateGroup = async (req, res, next) => {
let t=await sequelize.transaction();
    const { groupname, users } = req.body
    const Id = req.params.userId
    try {
        const Group = await GroupDB.create({
            Name: groupname
        },{transaction:t})
        const { id } = Group
        if(users){
            var Users = users.map(user => ({ userId: user.id, groupId: id }))
        }else{
            Users=[]
        }
        let GroupUser;
        if(Users){
            GroupUser = await GroupMembersDB.bulkCreate([...Users, { userId: Id, groupId: id, admin: true }],{transaction:t});
        }else{
            GroupUser = await GroupMembersDB.create({ userId: Id, groupId: id, admin: true },{transaction:t});
        }
        await t.commit()
        const groupmembers = await GroupMembersDB.findAll({
            where: { userId: Id }
        });
        const groupIds = groupmembers.map(groupmember => groupmember.groupId);
const groups = await GroupDB.findAll({
    where: {
        id: {
            [Op.in]: groupIds
        }
    }
});
        res.status(200).json({groupCreated: Group ,users: GroupUser,groups:groups});
    } catch (err) {
        if (t) {
            await t.rollback();
        }
        console.log(err, "While Creating Group")
        res.status(500).json({ message: "Error On Server" })
    }
}

exports.addMemberGroup=async(req,res,next)=>{
    try {
        const { groupid, users } = req.body;
        const userId = req.params.userId;
    
        if (!groupid) {
            throw new Error("Missing groupid in request body");
        }
    
        let groupUser = null;
    
if (users && users.length > 0) {
    const userUpdates = users.map(user => ({ groupId: groupid }));
    await GroupMembersDB.update({ groupId: groupid }, {
        where: { userId: { [Op.in]: userUpdates.map(u => u.userId) } }
    });
}   
        const groupmembers = await GroupMembersDB.findAll({
            where: { userId }
        });
    
        const groupIds = groupmembers.map(groupmember => groupmember.groupId);
    
        const groups = await GroupDB.findAll({
            where: {
                id: {
                    [Op.in]: groupIds
                }
            }
        });
    
        res.status(200).json({ users: groupUser, groups });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Error on the server" });
    }
}

exports.postUserToExistGroup = async (req, res, next) => {
let t=await sequelize.transaction();
    try {
        const { groupid, users } = req.body;
        const userId = req.params.userId;
        if (!groupid || !users || users.length === 0) {
            return res.status(400).json({ message: "Invalid request data" });
        }
        const userAssociations = users.map(user => ({ userId: user.id, groupId: groupid }));
        const addedUsers = await GroupMembersDB.bulkCreate(userAssociations,{transaction:t});
        const groupmembers = await GroupMembersDB.findAll({
            where: { userId }
        });

        const groupIds = groupmembers.map(groupmember => groupmember.groupId);

        const groups = await GroupDB.findAll({
            where: {
                id: {
                    [Op.in]: groupIds
                }
            }
        });
        await t.commit()
        res.status(200).json({ users: addedUsers, groups });
    } catch (err) {
        if(t){
            await t.rollback()
        }
        console.error(err);
        res.status(500).json({ message: "Error on the server" });
    }
};

exports.getGroupMembers = async (req, res, next) => {
    const groupId = req.params.groupId
    try {
        const groupMembers = await GroupMembersDB.findAll({
            where: { groupId: groupId },
            attributes: ["id", "userId", "admin"]
        })
        const userID = groupMembers.map(user => user.userId)

        const users = await UserDB.findAll({
            where: { id: userID },
            attributes: ["id", "Name"]

        })

        const UpdateUser = users.map(user => ({
            ...user.dataValues,
            admin: groupMembers.find((groupUser) => groupUser.userId === user.id).admin
        }))
        res.status(200).json({ users: UpdateUser })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something Went Wrong" });
    }
}


exports.postMakeAdmin = async (req, res, next) => {
let t=await sequelize.transaction();
    const { groupId, userId } = req.body
    try {
        const Response = await GroupMembersDB.update(
            { admin: true },
            {
                where: {
                    [Op.and]: [{ userId: userId, groupId: groupId }]
                }
            },{transaction:t}
        )
        await t.commit()
        res.status(200).json({ message: "admin added",success:true })
    } catch (err) {
        if(t){
            await t.rollback()
        }
        console.log(err)
        res.status(500).json({ message: "Somthing Went Wrong" })

    }
}


exports.removeUserFromGroup = async (req, res, next) => {
let t=await sequelize.transaction();
    try {
        const { groupId, userId } = req.body;
        
        const adminUser = await GroupMembersDB.findOne({
            where: {
                userId: req.user.id,
                groupId: groupId,
                admin: true, 
            }
        });

        if (adminUser) {
            await GroupMembersDB.destroy({
                where: {
                    userId: userId,
                    groupId: groupId,
                }
            },{transaction:t});
            await t.commit()
            res.status(200).json({ message: "User removed from the group." });
        } else {
            res.status(403).json({ message: "Only admin can remove users from the group." });
        }
    } catch (err) {
        console.error(err, "Error while removing user from the group");
        res.status(500).json({ message: "Server error." });
    }
};

  

exports.postRemoveAsAdmin = async (req, res, next) => {
let t=await sequelize.transaction();
    const { groupId, userId } = req.body
    try {
        const Response = await GroupMembersDB.update(
            { admin: false },
            {
                where: {
                    [Op.and]: [{ userId: userId, groupId: groupId }]
                }
            },{transaction:t}
        )
        t.commit()
        res.status(200).json({ message: "admin removed" })
    } catch (err) {
        if(t){
            t.rollback()
        }
        console.log(err)
        res.status(500).json({ message: "Somthing Went Wrong" })

    }
}


exports.recentmsg=async(req,res,next)=>{
    try{
        const groupid=req.params.groupid;
        const activeuser=await user.findAll({where:{isLogin:true}});
        const totalNumberOfMessages = await groupchat.count({
            where: {
              groupId: groupid
            }
          });
          let messages;
          if(totalNumberOfMessages<=10){
            messages=totalNumberOfMessages
          }else{
             messages=totalNumberOfMessages-10
          }
        const msgs = await req.user.getMsgboxes({
            where: { groupId: groupid },
            order: [['createdAt', 'ASC']],
            limit: 10,
            offset: messages
          });
          
        res.status(201).json({users:activeuser,success:false,msgs:msgs});
    }catch(err){
        res.status(500).json({error:err,success:false});
    }

}