const Sequelize = require("sequelize")

const sequelize = require("../Util/Database")

const Archievedchats = sequelize.define("Archievedchats", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sent_to: {
        type: Sequelize.CHAR,
    },
    time_stamp:{
        type:Sequelize.DATE
    }
})

module.exports = group