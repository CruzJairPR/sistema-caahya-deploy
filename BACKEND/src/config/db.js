const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(` MongoDB Conectado de forma segura: ${conn.connection.host}`);
    } catch (error) {
        console.error(` Error al conectar a la base de datos: ${error.message}`);
        process.exit(1);
    }
};

module.exports = conectarDB;