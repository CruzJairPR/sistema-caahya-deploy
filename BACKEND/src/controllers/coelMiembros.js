const CoelMiembro = require('../models/CoelMiembros');

// GET - Obtener todos los miembros
exports.obtenerTodos = async (req, res) => {
    try {
        const miembros = await CoelMiembro.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            total: miembros.length,
            data: miembros
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los miembros',
            error: error.message
        });
    }
};

// GET - Obtener un miembro por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const miembro = await CoelMiembro.findById(id);

        if (!miembro) {
            return res.status(404).json({
                success: false,
                message: 'Miembro no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: miembro
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el miembro',
            error: error.message
        });
    }
};

/// POST - Crear nuevo miembro (Versión Tolerante y Adaptable)
exports.crear = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en req.body:", req.body);

        const {
            idioma, Idioma,
            integrante, Integrante, nombre, Nombre,
            cargo, Cargo,
            adscripcion, Adscripción, ads,
            periodo_integrante, periodoIntegrante, periodo, Periodo,
            fecha_inicio_integrante, fechaInicioIntegrante, fecha_inicio,
            fecha_final_integrante, fechaFinalIntegrante, fecha_final,
            coordinacion, Coordinacion
        } = req.body;

        const valorIdioma = idioma || Idioma || "";
        const valorIntegrante = integrante || Integrante || nombre || Nombre || "";
        const valorCargo = cargo || Cargo || "";
        const valorAdscripcion = adscripcion || Adscripción || ads || "";

        const pIntegrante = periodo_integrante || periodoIntegrante || periodo || Periodo || "";
        const fInicioInt = fecha_inicio_integrante || fechaInicioIntegrante || fecha_inicio || null;
        const fFinalInt = fecha_final_integrante || fechaFinalIntegrante || fecha_final || null;

        const coordData = coordinacion || Coordinacion || {};
        const esCoord = coordData.es_coordinador !== undefined ? Boolean(coordData.es_coordinador) : (req.body.es_coordinador || false);
        const coordPeriodo = coordData.periodo || req.body.coordinador_periodo || null;
        const coordFechaInicio = coordData.fecha_inicio || req.body.coordinador_fecha_inicio || null;
        const coordFechaFinal = coordData.fecha_final || req.body.coordinador_fecha_final || null;

        const nuevoMiembro = new CoelMiembro({
            idioma: valorIdioma.trim() ? valorIdioma.trim() : undefined,
            integrante: valorIntegrante.trim() ? valorIntegrante.trim() : undefined,
            cargo: valorCargo.trim() ? valorCargo.trim() : undefined,
            adscripcion: valorAdscripcion.trim() ? valorAdscripcion.trim() : undefined,
            periodo_integrante: {
                periodo: typeof pIntegrante === 'string' ? pIntegrante.trim() : pIntegrante?.periodo || null,
                fecha_inicio: fInicioInt ? new Date(fInicioInt) : null,
                fecha_final: fFinalInt ? new Date(fFinalInt) : null
            },
            coordinacion: {
                es_coordinador: esCoord,
                periodo: coordPeriodo ? coordPeriodo.trim() : null,
                fecha_inicio: coordFechaInicio ? new Date(coordFechaInicio) : null,
                fecha_final: coordFechaFinal ? new Date(coordFechaFinal) : null
            }
        });

        const miembroGuardado = await nuevoMiembro.save();
        console.log(`✅ Nuevo miembro creado con éxito:`, miembroGuardado._id);

        res.status(201).json({
            success: true,
            message: 'Miembro creado correctamente',
            data: miembroGuardado
        });
    } catch (error) {
        console.error('❌ Error al crear miembro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el miembro',
            error: error.message
        });
    }
};

// PUT - Actualizar miembro
exports.actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { idioma, integrante, cargo, adscripcion, periodo_integrante, coordinacion } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const updateData = {};
        if (idioma !== undefined) updateData.idioma = idioma ? idioma.trim() : undefined;
        if (integrante !== undefined) updateData.integrante = integrante ? integrante.trim() : undefined;
        if (cargo !== undefined) updateData.cargo = cargo ? cargo.trim() : undefined;
        if (adscripcion !== undefined) updateData.adscripcion = adscripcion ? adscripcion.trim() : undefined;

        if (periodo_integrante !== undefined) {
            updateData.periodo_integrante = {
                periodo: periodo_integrante.periodo?.trim() || null,
                fecha_inicio: periodo_integrante.fecha_inicio ? new Date(periodo_integrante.fecha_inicio) : null,
                fecha_final: periodo_integrante.fecha_final ? new Date(periodo_integrante.fecha_final) : null
            };
        }

        if (coordinacion !== undefined) {
            updateData.coordinacion = {
                es_coordinador: Boolean(coordinacion.es_coordinador),
                periodo: coordinacion.periodo?.trim() || null,
                fecha_inicio: coordinacion.fecha_inicio ? new Date(coordinacion.fecha_inicio) : null,
                fecha_final: coordinacion.fecha_final ? new Date(coordinacion.fecha_final) : null
            };
        }

        const miembroActualizado = await CoelMiembro.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!miembroActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Miembro no encontrado'
            });
        }

        console.log(`✅ Miembro actualizado:`, id);

        res.status(200).json({
            success: true,
            message: 'Miembro actualizado correctamente',
            data: miembroActualizado
        });
    } catch (error) {
        console.error('❌ Error al actualizar miembro:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al actualizar el miembro',
            error: error.message
        });
    }
};

// DELETE - Eliminar miembro
exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const miembroEliminado = await CoelMiembro.findByIdAndDelete(id);

        if (!miembroEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Miembro no encontrado'
            });
        }

        console.log(`✅ Miembro eliminado:`, id);

        res.status(200).json({
            success: true,
            message: 'Miembro eliminado correctamente',
            data: miembroEliminado
        });
    } catch (error) {
        console.error('❌ Error al eliminar miembro:', error);

        res.status(500).json({
            success: false,
            message: 'Error al eliminar el miembro',
            error: error.message
        });
    }
};