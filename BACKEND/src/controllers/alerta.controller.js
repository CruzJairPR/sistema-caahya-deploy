const Alerta = require("../models/Alerta");

// Obtener alertas activas para el rol del usuario logueado
const obtenerAlertasPorRol = async (req, res) => {
    try {
        // Asumiendo que tu middleware de autenticación inyecta el rol en req.usuario
        // O bien, puedes recibirlo por query param (?rol=secretaria_aux_1) si prefieres flexibilidad
        const rolUsuario = req.usuario?.rol || req.query.rol;

        if (!rolUsuario) {
            return res.status(400).json({ mensaje: "No se especificó el rol del usuario" });
        }

        const alertas = await Alerta.find({
            rolDestino: rolUsuario,
            leida: false,
        }).sort({ createdAt: -1 });

        res.status(200).json(alertas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las alertas", error: error.message });
    }
};

// Marcar alerta como leída o pospuesta
const posponerAlerta = async (req, res) => {
    try {
        const { id } = req.params;

        const alertaActualizada = await Alerta.findByIdAndUpdate(
            id,
            { leida: true },
            { new: true }
        );

        if (!alertaActualizada) {
            return res.status(404).json({ mensaje: "Alerta no encontrada" });
        }

        res.status(200).json({ mensaje: "Alerta pospuesta con éxito", alerta: alertaActualizada });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la alerta", error: error.message });
    }
};

// (Opcional) Crear una alerta nueva desde el sistema
const crearAlerta = async (req, res) => {
    try {
        const { rolDestino, titulo, mensaje, referenciaId } = req.body;

        const nuevaAlerta = new Alerta({
            rolDestino,
            titulo,
            mensaje,
            referenciaId,
        });

        const guardada = await nuevaAlerta.save();
        res.status(201).json(guardada);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear la alerta", error: error.message });
    }
};

module.exports = {
    obtenerAlertasPorRol,
    posponerAlerta,
    crearAlerta,
};