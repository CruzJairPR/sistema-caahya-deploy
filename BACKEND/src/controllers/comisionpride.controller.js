const ComisionPride = require('../models/ComisionPride');

// GET /api/pride

const getAll = async (req, res) => {
    try {
        const { entidad, tipoDeMiembro, periodo, miembro, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (entidad) filter.entidad = { $regex: entidad, $options: 'i' };
        if (tipoDeMiembro) filter.tipoDeMiembro = { $regex: tipoDeMiembro, $options: 'i' };
        if (periodo) filter.periodo = { $regex: periodo, $options: 'i' };
        if (miembro) filter.miembro = { $regex: miembro, $options: 'i' };

        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            ComisionPride.find(filter).skip(skip).limit(Number(limit)).sort({ numero: 1 }),
            ComisionPride.countDocuments(filter),
        ]);

        res.json({ total, page: Number(page), limit: Number(limit), data });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener comisiones PRIDE', error: error.message });
    }
};

// GET /api/pride/:id
const getById = async (req, res) => {
    try {
        const doc = await ComisionPride.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Comisión no encontrada' });
        res.json(doc);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la comisión', error: error.message });
    }
};

// POST /api/pride
const create = async (req, res) => {
    try {
        const doc = await ComisionPride.create(req.body);
        res.status(201).json(doc);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear comisión', error: error.message });
    }
};

// PUT /api/pride/:id
const update = async (req, res) => {
    try {
        const doc = await ComisionPride.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) return res.status(404).json({ message: 'Comisión no encontrada' });
        res.json(doc);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar comisión', error: error.message });
    }
};

// DELETE /api/pride/:id
const remove = async (req, res) => {
    try {
        const doc = await ComisionPride.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Comisión no encontrada' });
        res.json({ message: 'Comisión eliminada correctamente', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar comisión', error: error.message });
    }
};

module.exports = { getAll, getById, create, update, remove };