const CoelPlanTrabajo = require('../../models/secretaria-aux2/CoelPlanTrabajo');

const crearControladorComision = (nombreComision) => {
  return {
    obtenerPlanes: async (req, res) => {
      try {
        const data = await CoelPlanTrabajo.find({ comision: nombreComision }).sort({ createdAt: -1 });
        res.json({ success: true, data });
      } catch (error) {
        console.error('❌ Error en obtenerPlanes:', error.message);
        res.status(500).json({ success: false, mensaje: 'Error al obtener los planes' });
      }
    },

    crearPlan: async (req, res) => {
      try {
        const nuevo = new CoelPlanTrabajo({ ...req.body, comision: nombreComision });
        const data = await nuevo.save();
        res.status(201).json({ success: true, data });
      } catch (error) {
        console.error('❌ Error en crearPlan:', error.message);
        res.status(400).json({ success: false, mensaje: error.message || 'Error al guardar el plan' });
      }
    },

    actualizarPlan: async (req, res) => {
      try {
        const { id } = req.params;
        // Se añade runValidators: true para que respete los campos requeridos al editar
        const data = await CoelPlanTrabajo.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        });

        if (!data) {
          return res.status(404).json({ success: false, mensaje: "No encontrado" });
        }

        res.json({ success: true, data });
      } catch (error) {
        console.error('❌ Error en actualizarPlan:', error.message);
        res.status(400).json({ success: false, mensaje: error.message || 'Error al actualizar el plan' });
      }
    },

    eliminarPlan: async (req, res) => {
      try {
        const { id } = req.params;
        const data = await CoelPlanTrabajo.findByIdAndDelete(id);

        if (!data) {
          return res.status(404).json({ success: false, mensaje: "No encontrado" });
        }

        res.json({ success: true, mensaje: "Eliminado correctamente" });
      } catch (error) {
        console.error('❌ Error en eliminarPlan:', error.message);
        res.status(500).json({ success: false, mensaje: 'Error al eliminar el plan' });
      }
    }
  };
};

module.exports = crearControladorComision;