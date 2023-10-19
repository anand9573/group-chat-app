const Sequelize = require("sequelize")

const sequelize = require("../Util/Database")

const Messages = sequelize.define("messages", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    sent_to: {
        type: Sequelize.CHAR,
    },
    message: {
        type: Sequelize.TEXT
    },
    time_stamp:{
        type:Sequelize.DATE
    }
})

module.exports = Messages