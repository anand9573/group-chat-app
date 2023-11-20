const MessagesDB = require("../Models/Messages")
const sequelize=require('../Util/Database')
const { Op } = require("sequelize");
const User=require('../Models/User');
const group_members = require("../Models/GroupMember");
const Messages = require("../Models/Messages");


exports.postMesssages = async (req, res, next) => {
let t=await sequelize.transaction();
    
    const send_to = req.params.send_to
    const user=await User.findByPk(send_to)
    const { message, date, userID } = req.body
    console.log({ message, date, userID });
    try {
        if(!user){
            const msg = await MessagesDB.create({
                sent_to: send_to,
                message: message,
                time_stamp: date,
                userId: userID,
                groupId:send_to
            },{transaction:t})
            await t.commit()
            res.status(200).json({ message: msg, status: true });
        }else{
            const msg = await MessagesDB.create({
                sent_to: send_to,
                message: message,
                time_stamp: date,
                userId: userID
            },{transaction:t})
            await t.commit()
            res.status(200).json({ message: msg, status: true });
        }
    } catch (err) {
        if(t){
            await t.rollback()
        }
        console.log(err)
        res.status(500).json({ message: "Somthing Went Wrong" });
    }
}

exports.getOneToOneMessages = async (req, res, next) => {
    const { userId, user2Id } = req.params
    try {
        const messages = await MessagesDB.findAll({
            where: {
                [Op.or]:
                    [
                        { [Op.and]: [{ userId: userId }, { sent_to: user2Id },] },
                        { [Op.and]: [{ userId: user2Id }, { sent_to: userId },] }
                    ]
            },
            order: [['createdAt', 'ASC']]
        });
        res.status(201).json({ messages: messages });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Somthing Went Wrong" });
    }
}

exports.getGroupMessages = async (req, res, next) => {
    const {groupId }= req.params
    const offset = parseInt(req.params.offset);
    // const messages = await MessagesDB.findAll({ where: { groupId: groupId } ,
    //     order: [['createdAt', 'ASC']],
    //     // limit: 10,
    //     include: {
    //         attributes: ["id", "Name"],
    //         model: User,
    //         through: {
    //             model: group_Members,
    //             attributes: ["id", "admin"]
    //         }
    //     }
    //     // offset: offset,
    // })
    // const user = await Messages.findByPk(groupId, {
    //     attributes: ["id", "message", "file", "userId"],
    //     include: {
    //         attributes: ["id", "Name"],
    //         model: GroupDB,
    //         through: {
    //             model: Group_Members,
    //             attributes: ["id", "admin"]
    //         }
    //     }
    // }
    // )
    // const users = await UserDB.findAll(
    //     {
    //         where: { [Op.not]: { id: userid } },
    //         attributes: ["id", "Name", "email", "mobile"]
    //     }
    // )
    // // console.log('offset->',offset,groupId);
    const user=await User.findByPk(groupId);
    try {
        if(!user){
            const messages = await MessagesDB.findAll({ where: { groupId: groupId } ,
                order: [['createdAt', 'DESC']],
                limit: 10,
                // include: {
                //     attributes: ["id", "Name"],
                //     model: User,
                //     through: {
                //         model:group_members,
                //         attributes: ["id", "admin"]
                //     }
                // }
                offset: offset*10
            })
            // const messages = await MessagesDB.findAll({ where: { groupId: groupId } ,
            //     order: [['createdAt', 'ASC']],
            //     // limit: 10,
            //     // offset: offset,
            // })
            res.status(201).json({ messages: messages });
        }else{
            const messages = await MessagesDB.findAll({
                where: {
                    [Op.or]:
                        [
                            { [Op.and]: [{ userId: req.user.id }, { sent_to: groupId },] },
                            { [Op.and]: [{ userId: groupId }, { sent_to: req.user.id },] }
                        ]
                },
                order: [['createdAt', 'DESC']],
                limit: 10,
                offset: offset*10
              });
            res.status(201).json({ messages: messages });
        }
    } catch (err) {
        console.log(err, "ERRRRRRRRRRR")
        res.status(500).json({ message: "Somthing Went Wrong" })
    }
}




  



