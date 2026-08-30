const CoelPlanTrabajo = require('../models/CoelPlanTrabajo');

const crearControladorComision = (nombreComision) => {
  return {
    obtenerPlanes: async (req, res) => {
      try {
        const data = await CoelPlanTrabajo.find({ comision: nombreComision }).sort({ createdAt: -1 });
        res.json({ success: true, data });
      } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
      }
    },
    crearPlan: async (req, res) => {
      try {
        const nuevo = new CoelPlanTrabajo({ ...req.body, comision: nombreComision });
        const data = await nuevo.save();
        res.status(201).json({ success: true, data });
      } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
      }
    },
    actualizarPlan: async (req, res) => {
      try {
        const { id } = req.params;
        const data = await CoelPlanTrabajo.findByIdAndUpdate(id, req.body, { new: true });
        if (!data) return res.status(404).json({ success: false, mensaje: "No encontrado" });
        res.json({ success: true, data });
      } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
      }
    },
    eliminarPlan: async (req, res) => {
      try {
        const { id } = req.params;
        const data = await CoelPlanTrabajo.findByIdAndDelete(id);
        if (!data) return res.status(404).json({ success: false, mensaje: "No encontrado" });
        res.json({ success: true, mensaje: "Eliminado correctamente" });
      } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
      }
    }
  };
};

module.exports = crearControladorComision;