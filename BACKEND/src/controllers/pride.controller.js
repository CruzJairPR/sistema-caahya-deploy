const crearControladorPride = (Modelo) => {
    return {
        obtenerTodos: async (req, res) => {
            try {
                const registros = await Modelo.find().sort({ createdAt: -1 });
                res.status(200).json(registros);
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        },

        crear: async (req, res) => {
            try {
                const nuevoRegistro = new Modelo(req.body);
                const guardado = await nuevoRegistro.save();
                res.status(201).json({ success: true, data: guardado });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
        },

        actualizar: async (req, res) => {
            try {
                const { id } = req.params;
                const actualizado = await Modelo.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
                if (!actualizado) {
                    return res.status(404).json({ success: false, error: "Registro no encontrado" });
                }
                res.status(200).json({ success: true, data: actualizado });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
        },

        eliminar: async (req, res) => {
            try {
                const { id } = req.params;
                const eliminado = await Modelo.findByIdAndDelete(id);
                if (!eliminado) {
                    return res.status(404).json({ success: false, error: "Registro no encontrado" });
                }
                res.status(200).json({ success: true, message: "Eliminado correctamente" });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    };
};

module.exports = crearControladorPride;