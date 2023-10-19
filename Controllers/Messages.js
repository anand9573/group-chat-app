const MessagesDB = require("../Models/Messages")
const sequelize=require('../Util/Database')
const { Op } = require("sequelize")


exports.postMesssages = async (req, res, next) => {
let t=await sequelize.transaction();
    
    const send_to = req.params.send_to
    const { message, date, userID } = req.body
    console.log({ message, date, userID });
    try {
        const msg = await MessagesDB.create({
            sent_to: send_to,
            message: message,
            time_stamp: date,
            userId: userID,
            groupId:send_to
        },{transaction:t})
        await t.commit()
        res.status(200).json({ message: msg, status: true });
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
    const { groupId } = req.params
    try {
        const messages = await MessagesDB.findAll({ where: { sent_to: groupId } ,
            order: [['createdAt', 'ASC']]})
        res.status(201).json({ messages: messages });
    } catch (err) {
        console.log(err, "ERRRRRRRRRRR")
        res.status(500).json({ message: "Somthing Went Wrong" })
    }
}
  



