const filosofia = require("../models/Filosofia");

// READ: GET /api/v1/filosofia
exports.obtenerfilosofia = async (req, res) => {
    try {
        const filosofia = await filosofia.find().sort({ nombre: 1 });
        res.status(200).json({ success: true, data: filosofia });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// CREATE: POST /api/v1/filosofia   
exports.crearfilosofia = async (req, res) => {
    try {
        const nuevofilosofia = await filosofia.create(req.body);
        res.status(201).json({ success: true, data: nuevofilosofia });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// UPDATE: PUT /api/v1/filosofia/:id
exports.actualizarfilosofia = async (req, res) => {
    try {
        const filosofiaActualizado = await Diseno.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!filosofiaActualizado) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: filosofiaActualizado });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// DELETE: DELETE /api/v1/filosofia/:id
exports.eliminarfilosofia = async (req, res) => {
    try {
        const filosofiaEliminado = await filosofia.findByIdAndDelete(req.params.id);

        if (!filosofiaEliminado) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};