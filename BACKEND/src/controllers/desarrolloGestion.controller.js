const DesarrolloGestion = require("../models/DesarrolloGestion");

// READ: GET /api/v1/desarrollo-gestion
exports.obtenerDesarrolloGestion = async (req, res) => {
    try {
        const desarrolloGestion = await DesarrolloGestion.find().sort({ nombre: 1 });
        res.status(200).json({ success: true, data: desarrolloGestion });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// CREATE: POST /api/v1/desarrollo-gestion
exports.crearDesarrolloGestion = async (req, res) => {
    try {
        const nuevoDesarrolloGestion = await DesarrolloGestion.create(req.body);
        res.status(201).json({ success: true, data: nuevoDesarrolloGestion });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// UPDATE: PUT /api/v1/desarrollo-gestion/:id
exports.actualizarDesarrolloGestion = async (req, res) => {
    try {
        const desarrolloGestionActualizado = await DesarrolloGestion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!desarrolloGestionActualizado) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: desarrolloGestionActualizado });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// DELETE: DELETE /api/v1/desarrollo-gestion/:id
exports.eliminarDesarrolloGestion = async (req, res) => {
    try {
        const desarrolloGestionEliminada = await DesarrolloGestion.findByIdAndDelete(req.params.id);

        if (!desarrolloGestionEliminada) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};