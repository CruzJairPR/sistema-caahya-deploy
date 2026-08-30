const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Tu URI de MongoDB Atlas (la misma que usas en tu .env o Compass)
const uri = "mongodb+srv://cruzjairperez_db_user:NSLGwhsnMB11CPsy@cluster0.kkgm2bh.mongodb.net/sistema-consultas?retryWrites=true&w=majority";
const dbName = "sistema-consultas";

async function exportarBaseDeDatos() {
    const client = new MongoClient(uri);
    try {
        console.log("Conectando a MongoDB Atlas...");
        await client.connect();
        console.log("¡Conectado con éxito!");

        const db = client.db(dbName);

        // Carpeta donde se guardarán los respaldos para Docker
        const outputDir = path.join(__dirname, 'BACKEND', 'mongo-init');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Obtener la lista de todas las colecciones (tablas)
        const collections = await db.listCollections().toArray();
        console.log(`Se encontraron ${collections.length} colecciones. Exportando...`);

        for (let colInfo of collections) {
            const colName = colInfo.name;
            console.log(`Exportando colección: ${colName}`);

            const data = await db.collection(colName).find({}).toArray();

            // Guardar cada colección en un archivo .json dentro de la carpeta mongo-init
            const filePath = path.join(outputDir, `${colName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        }

        console.log("\n¡Listo! Todas las colecciones han sido exportadas exitosamente en: BACKEND/mongo-init");
    } catch (error) {
        console.error("Ocurrió un error al exportar:", error);
    } finally {
        await client.close();
    }
}

exportarBaseDeDatos();