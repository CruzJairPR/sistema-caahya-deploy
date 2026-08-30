const Coel = require('../models/Coel');

// Obtener todos los registros de la comisión COEL
const obtenerCoel = async (req, res) => {
    try {
        const registros = await Coel.find();

        res.status(200).json({
            success: true,
            count: registros.length,
            data: registros
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener los datos de la comisión COEL'
        });
    }
};

// Crear un nuevo registro en COEL
const crearCoel = async (req, res) => {
    try {
        const nuevoRegistro = await Coel.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Registro añadido con éxito a la comisión COEL',
            data: nuevoRegistro
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al guardar el registro en la base de datos'
        });
    }
};

module.exports = {
    obtenerCoel,
    crearCoel
};