const Sequelize = require("sequelize")

const sequelize = require("../Util/Database")

const User = sequelize.define("user", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    mobile: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
    }, 
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = User