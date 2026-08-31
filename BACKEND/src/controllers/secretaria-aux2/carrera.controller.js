const CarreraItem = require('../../models/secretaria-aux2/Carrera');

const MAPA_NOMBRES_CARRERAS = {
    desarrollogestion: "DESARROLLO Y GESTIÓN",
    arquitectura: "ARQUITECTURA",
    diseno: "DISEÑO",
    filosofia: "FILOSOFÍA",
    historia: "HISTORIA",
    pedagogia: "PEDAGOGÍA"
};
exports.obtenerPorCarrera = async (req, res) => {
    try {
        const { carrera } = req.params;
        const carreraSlug = carrera ? carrera.toLowerCase().trim() : "";

        console.log("========================================");
        console.log("🟢 [DEBUG] Parámetro recibido en URL:", carrera);

        const registros = await CarreraItem.find({});
        console.log(`📦 [DEBUG] Total de registros en 'carreras_miembros': ${registros.length}`);

        const normalizar = (str) =>
            (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

        const slugBuscado = normalizar(carreraSlug);

        // Filtro inteligente y flexible
        const datosFiltrados = registros.filter(item => {
            const textoCarreraBD = normalizar(item.carrera);
            const textoIdBD = normalizar(item.carreraId);

            // Coincidencia estándar por slug o texto exacto
            const matchDirecto =
                (textoCarreraBD && (textoCarreraBD.includes(slugBuscado) || slugBuscado.includes(textoCarreraBD))) ||
                (textoIdBD && (textoIdBD.includes(slugBuscado) || slugBuscado.includes(textoIdBD)));

            // Validación específica de respaldo para desarrollo y gestión por palabras clave
            const esDesarrolloGestion = slugBuscado.includes("desarrollo") && slugBuscado.includes("gestion");
            const bdEsDesarrolloGestion = textoCarreraBD.includes("desarrollo") && textoCarreraBD.includes("gestion");

            return matchDirecto || (esDesarrolloGestion && bdEsDesarrolloGestion);
        });

        console.log(`🎯 [DEBUG] Registros encontrados tras el filtrado: ${datosFiltrados.length}`);

        const datosMapeados = datosFiltrados.map(item => {
            const obj = item.toObject();
            const valorSede = obj.sede || obj.entidad || "FACULTAD";
            return {
                ...obj,
                sede: valorSede,
                entidad: valorSede
            };
        });

        console.log("========================================");
        res.json(datosMapeados);
    } catch (error) {
        console.error("❌ [ERROR en obtenerPorCarrera]:", error);
        res.status(500).json({ mensaje: "Error al obtener los miembros", error: error.message });
    }
};

exports.crearParaCarrera = async (req, res) => {
    try {
        const { carrera } = req.params;
        const carreraSlug = carrera ? carrera.toLowerCase().trim() : "";

        // Si el usuario no mandó el campo carrera en el body, lo autocompletamos con la URL
        const nombreCarreraPorDefecto = MAPA_NOMBRES_CARRERAS[carreraSlug] || carreraSlug.toUpperCase();

        const nuevoDato = new CarreraItem({
            ...req.body,
            carrera: req.body.carrera && req.body.carrera.trim() !== "" ? req.body.carrera : nombreCarreraPorDefecto,
            carreraId: carreraSlug,
            sede: req.body.sede || req.body.entidad || "FACULTAD",
            entidad: req.body.sede || req.body.entidad || "FACULTAD"
        });

        const guardado = await nuevoDato.save();
        res.status(201).json(guardado);
    } catch (error) {
        console.error("❌ [ERROR al crear]:", error);
        res.status(500).json({ mensaje: "Error al crear el miembro", error: error.message });
    }
};

exports.actualizarRegistro = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await CarreraItem.findByIdAndUpdate(id, req.body, { new: true });
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el miembro", error: error.message });
    }
};

exports.eliminarRegistro = async (req, res) => {
    try {
        const { id } = req.params;
        await CarreraItem.findByIdAndDelete(id);
        res.json({ mensaje: "Miembro eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el miembro", error: error.message });
    }
};