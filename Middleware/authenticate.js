const JWT = require('jsonwebtoken');
const User = require('../Models/User');

exports.authentication = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token missing' });
        }
            const user = JWT.verify(token, process.env.TOKEN_SECRET);
            const authorized = await User.findByPk(user.id);

            if (authorized) {
                req.user = authorized;
                next();
            } else {
                return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
            }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
