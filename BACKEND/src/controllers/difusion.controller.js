const Difusion = require('../models/Difusion');

/**
 * @desc    Obtener todos los registros de difusión y extensión
 * @route   GET /api/v1/difusion
 */
const obtenerDifusion = async (req, res) => {
    try {
        const registros = await Difusion.find().sort({ numero: 1 });

        res.status(200).json({
            success: true,
            count: registros.length,
            data: registros
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener los datos de la comisión de difusión y extensión'
        });
    }
};

/**
 * @desc    Insertar un nuevo registro con número secuencial automático
 * @route   POST /api/v1/difusion
 */
const crearDifusion = async (req, res) => {
    try {
        // 1. Contamos cuántos documentos existen actualmente en la colección de difusión
        const totalRegistros = await Difusion.countDocuments({});

        // 2. El siguiente número será el total actual + 1
        const siguienteNumero = totalRegistros + 1;

        // 3. Inyectamos el número calculado y aseguramos los campos opcionales del nuevo JSON
        const datosParaGuardar = {
            ...req.body,
            "No.": siguienteNumero,
            "numero": siguienteNumero
        };

        const nuevoRegistro = await Difusion.create(datosParaGuardar);

        res.status(201).json({
            success: true,
            message: 'Registro añadido con éxito a la comisión de difusión',
            data: nuevoRegistro
        });
    } catch (error) {
        console.error("Error al crear registro de difusión:", error.message);
        res.status(500).json({
            success: false,
            error: 'Error al guardar el registro en la base de datos'
        });
    }
};

/**
 * @desc    Actualizar un registro existente
 * @route   PUT /api/v1/difusion/:id
 */
const actualizarDifusion = async (req, res) => {
    try {
        const registroActualizado = await Difusion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!registroActualizado) {
            return res.status(404).json({ success: false, error: 'Registro no encontrado' });
        }

        res.status(200).json({ success: true, data: registroActualizado });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @desc    Eliminar un registro permanente
 * @route   DELETE /api/v1/difusion/:id
 */
const eliminarDifusion = async (req, res) => {
    try {
        const eliminado = await Difusion.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return res.status(404).json({ success: false, error: 'Registro no encontrado' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    obtenerDifusion,
    crearDifusion,
    actualizarDifusion,
    eliminarDifusion
};