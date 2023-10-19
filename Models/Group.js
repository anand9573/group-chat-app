const Sequelize = require("sequelize")

const sequelize = require("../Util/Database")

const group = sequelize.define("group", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = group