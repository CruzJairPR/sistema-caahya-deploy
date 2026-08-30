const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const importar = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔄 Conectado a MongoDB para importar respaldos...');

        const dirPath = path.join(__dirname, 'mongo-init');
        const archivos = fs.readdirSync(dirPath).filter(file => file.endsWith('.json'));

        for (const archivo of archivos) {
            const nombreColeccion = path.basename(archivo, '.json');
            const rutaArchivo = path.join(dirPath, archivo);
            const contenido = JSON.parse(fs.readFileSync(rutaArchivo, 'utf8'));

            if (Array.isArray(contenido) && contenido.length > 0) {
                const collection = mongoose.connection.collection(nombreColeccion);
                await collection.deleteMany({}); // Limpia para evitar duplicados
                await collection.insertMany(contenido);
                console.log(`✅ Colección [${nombreColeccion}] importada con éxito (${contenido.length} registros).`);
            }
        }

        console.log('🎉 ¡Todas las tablas han sido pobladas correctamente!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al importar los datos:', error);
        process.exit(1);
    }
};

importar();