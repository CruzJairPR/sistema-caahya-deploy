const Dgapa_General = require('../models/DgapaGeneral');

const obtenerDgapaGeneralPorPestana = async (req, res) => {
    try {
        const { pestana } = req.params;
        const datos = await Dgapa_General.find({ pestanaOrigen: pestana }).sort({ numero: 1 });
        res.status(200).json(datos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos: ' + error.message });
    }
};

const crearComision = async (req, res) => {
    try {
        const { pestana } = req.params;
        const nuevoDgapaGeneral = new Dgapa_General({
            ...req.body,
            pestanaOrigen: pestana
        });
        const guardado = await nuevoDgapaGeneral.save();
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el registro: ' + error.message });
    }
};

const actualizarDgapaGeneral = async (req, res) => {
    try {
        const { id } = req.params;

        const datosLimpios = {
            numero: req.body.Numero ?? req.body.numero,
            area: req.body.Area ?? req.body.area,
            comision: req.body.Comision ?? req.body.comision,
            fuenteDeDesignacion: req.body['Fuente de Designacion'] || req.body.fuenteDeDesignacion,
            entidad: req.body.Entidad ?? req.body.entidad,
            miembro: req.body.Miembro ?? req.body.miembro,
            categoriaYNivel: req.body['Categoria y nivel'] || req.body.categoriaYNivel,
            pride: req.body.PRIDE ?? req.body.pride,
            periodo: req.body.Periodo ?? req.body.periodo,
            inicio: req.body.Inicio ?? req.body.inicio,
            termino: req.body.Termino ?? req.body.termino,
            mail: req.body.Mail ?? req.body.mail,
            disciplina: req.body.Disciplina ?? req.body.disciplina,
            especialidad: req.body.Especialidad ?? req.body.especialidad,
            ultimaModificacion: req.body['Ultima modificacion a la base'] || req.body.ultimaModificacion,
            miembroAnterior: req.body['Miembro anterior'] || req.body.miembroAnterior,
            adscripcion: req.body.Adscripcion ?? req.body.adscripcion,
            pestanaOrigen: req.body.pestanaOrigen,
            urgencia: req.body.urgencia
        };
        const actualizada = await Dgapa_General.findByIdAndUpdate(
            id,
            { $set: datosLimpios },
            { returnDocument: 'after', runValidators: true }
        );

        if (!actualizada) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        res.status(200).json(actualizada);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar: ' + error.message });
    }
};

const eliminarDgapaGeneral = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminada = await Dgapa_General.findByIdAndDelete(id);
        if (!eliminada) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        res.status(200).json({ mensaje: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar: ' + error.message });
    }
};

module.exports = {
    obtenerDgapaGeneralPorPestana,
    crearComision,
    actualizarDgapaGeneral,
    eliminarDgapaGeneral
};