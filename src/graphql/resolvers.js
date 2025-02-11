const User = require('../models/user');

const resolvers = {
    Query: {
        getAllUsers: async () => await User.findAll(),
        getUserById: async (_, { id }) => await User.findByPk(id),
        getUserByEmail: async (_, { email }) => await User.findOne({ where: { email } }),
    },
};

module.exports = resolvers;