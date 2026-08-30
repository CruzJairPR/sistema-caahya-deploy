const Pedagogia = require("../models/Pedagogia");

// READ: GET /api/v1/pedagogia
exports.obtenerPedagogia = async (req, res) => {
    try {
        const pedagogia = await Pedagogia.find().sort({ nombre: 1 });
        res.status(200).json({ success: true, data: pedagogia });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// CREATE: POST /api/v1/pedagogia   
exports.crearPedagogia = async (req, res) => {
    try {
        const nuevoPedagogia = await Pedagogia.create(req.body);
        res.status(201).json({ success: true, data: nuevoPedagogia });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// UPDATE: PUT /api/v1/pedagogia/:id
exports.actualizarPedagogia = async (req, res) => {
    try {
        const pedagogiaActualizado = await Diseno.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!pedagogiaActualizado) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: pedagogiaActualizado });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// DELETE: DELETE /api/v1/pedagogia/:id
exports.eliminarPedagogia = async (req, res) => {
    try {
        const pedagogiaEliminado = await Pedagogia.findByIdAndDelete(req.params.id);

        if (!pedagogiaEliminado) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};