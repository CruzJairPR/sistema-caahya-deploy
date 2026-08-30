const historia = require("../models/Historia");

// READ: GET /api/v1/historia
exports.obtenerhistoria = async (req, res) => {
    try {
        const historia = await historia.find().sort({ nombre: 1 });
        res.status(200).json({ success: true, data: historia });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// CREATE: POST /api/v1/historia   
exports.crearhistoria = async (req, res) => {
    try {
        const nuevohistoria = await historia.create(req.body);
        res.status(201).json({ success: true, data: nuevohistoria });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// UPDATE: PUT /api/v1/historia/:id
exports.actualizarhistoria = async (req, res) => {
    try {
        const historiaActualizado = await Diseno.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!historiaActualizado) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: historiaActualizado });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// DELETE: DELETE /api/v1/historia/:id
exports.eliminarhistoria = async (req, res) => {
    try {
        const historiaEliminado = await historia.findByIdAndDelete(req.params.id);

        if (!historiaEliminado) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};