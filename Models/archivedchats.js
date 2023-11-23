const Sequelize = require("sequelize")

const sequelize = require("../Util/Database")

const Archievedchats = sequelize.define("Archievedchats", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    sentby: {
        type: Sequelize.CHAR,
    },
    sent_to: {
        type: Sequelize.CHAR,
    },
    message: {
        type: Sequelize.TEXT
    },
    file: {
        type: Sequelize.STRING
    },
    url: {
        type: Sequelize.STRING
    },
    time_stamp:{
        type:Sequelize.DATE
    },
    userId: {
        type: Sequelize.STRING,
    },
    groupId:{
        type:Sequelize.DATE
    }
})

module.exports = Archievedchats