const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Asegúrate de que apunta al modelo correcto
require("dotenv").config();

const resolvers = {
    Query: {
        getAllUsers: async () => await User.findAll(),
        getUserById: async (_, { id }) => await User.findByPk(id),
        getUserByEmail: async (_, { email }) => {
            console.log(`🔍 Buscando usuario con email: ${email}`);
            return await User.findOne({
                where: { email },
                attributes: ['id', 'email', 'password_hash']
            });
        },

        // 🔹 NUEVO: Resolver para autenticar al usuario y generar el token JWT
        authenticateUser: async (_, { email, password }) => {
            try {
                console.log(`🔍 Intentando autenticar usuario con email: ${email}`);

                // 1️⃣ Buscar usuario en la base de datos
                const user = await User.findOne({
                    where: { email },
                    attributes: ['id', 'email', 'password_hash']
                });

                if (!user) {
                    console.log("❌ Usuario no encontrado.");
                    return null;
                }

                console.log("✅ Usuario encontrado:", user.email);

                // 2️⃣ Comparar la contraseña ingresada con `password_hash`
                console.log("🔑 Comparando contraseñas...");
                const isMatch = await bcrypt.compare(password, user.password_hash);
                console.log("🔍 Resultado de comparación de contraseña:", isMatch);

                if (!isMatch) {
                    console.log("❌ Contraseña incorrecta.");
                    return null;
                }

                // 3️⃣ Generar token JWT si la autenticación es correcta
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET || "default_secret",
                    { expiresIn: "1h" }
                );

                console.log("✅ Token generado con éxito:", token);
                return token;
            } catch (error) {
                console.error("❌ Error en la autenticación:", error);
                return null;
            }
        }
    }
};

module.exports = resolvers;
