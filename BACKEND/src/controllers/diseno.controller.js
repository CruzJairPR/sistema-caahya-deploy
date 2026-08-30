const Diseno = require("../models/Diseno");

// READ: GET /api/v1/diseño
exports.obtenerDiseno = async (req, res) => {
    try {
        const diseno = await Diseno.find().sort({ nombre: 1 });
        res.status(200).json({ success: true, data: diseno });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// CREATE: POST /api/v1/diseño
exports.crearDiseno = async (req, res) => {
    try {
        const nuevoDiseno = await Diseno.create(req.body);
        res.status(201).json({ success: true, data: nuevoDiseno });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// UPDATE: PUT /api/v1/diseño/:id
exports.actualizarDiseno = async (req, res) => {
    try {
        const disenoActualizado = await Diseno.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!disenoActualizado) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: disenoActualizado });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// DELETE: DELETE /api/v1/diseño/:id
exports.eliminarDiseno = async (req, res) => {
    try {
        const disenoEliminado = await Diseno.findByIdAndDelete(req.params.id);

        if (!disenoEliminado) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};