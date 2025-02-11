const User = require('../models/user');

const resolvers = {
    Query: {
        getAllUsers: async () => await User.findAll(),
        getUserById: async (_, { id }) => await User.findByPk(id),
        getUserByEmail: async (_, { email }) => {
            console.log(`🔍 Buscando usuario con email: ${email}`);
            return await User.findOne({
                where: { email },
                attributes: ['id', 'email', 'password_hash']  // 🔥 Asegurar que incluya `password_hash`
            });
        }
    },
};

module.exports = resolvers;
