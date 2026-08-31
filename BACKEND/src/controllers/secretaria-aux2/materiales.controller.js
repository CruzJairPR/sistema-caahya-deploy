const CoelMateriales = require('../../models/secretaria-aux2/CoelMateriales');

const obtenerMateriales = async (req, res) => {
    try {
        const { tipo } = req.params;
        const data = await CoelMateriales.find({ tipoMaterial: tipo }).sort({ createdAt: -1 });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

const crearMaterial = async (req, res) => {
    try {
        const { tipo } = req.params;
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

        const nuevo = new CoelMateriales({
            titulo,
            descripcion: descripcion || "", // Si viene vacío, se guarda como string vacío
            nombreArchivo,
            archivoBase64,
            tipoMaterial: tipo
        });

        const data = await nuevo.save();
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

const actualizarMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, nombreArchivo, archivoBase64, tipoMaterial } = req.body;

        const updateData = {
            titulo,
            descripcion: descripcion || ""
        };

        if (tipoMaterial) {
            updateData.tipoMaterial = tipoMaterial;
        }

        if (archivoBase64 && nombreArchivo) {
            updateData.archivoBase64 = archivoBase64;
            updateData.nombreArchivo = nombreArchivo;
        }

        const data = await CoelMateriales.findByIdAndUpdate(id, updateData, { new: true });
        if (!data) {
            return res.status(404).json({ success: false, mensaje: "Material no encontrado" });
        }

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

const eliminarMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await CoelMateriales.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({ success: false, mensaje: "Material no encontrado" });
        }

        res.json({ success: true, mensaje: "Eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

module.exports = {
    obtenerMateriales,
    crearMaterial,
    actualizarMaterial,
    eliminarMaterial
};