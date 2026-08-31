const CoelSesion = require('../models/secretaria-aux2/CoelSesion');

const obtenerSesiones = async (req, res) => {
  try {
    const { tipo, categoria } = req.query;
    const filtro = {};
    if (tipo) filtro.tipo = tipo;
    if (categoria) filtro.categoria = categoria;

    const data = await CoelSesion.find(filtro).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error en obtenerSesiones:', error.message);
    res.status(500).json({ success: false, mensaje: 'Error al obtener las sesiones' });
  }
};

const crearSesion = async (req, res) => {
  try {
    // Rescatamos tipo y categoría del body o de los query params de la URL
    const tipo = req.body.tipo || req.query.tipo;
    const categoria = req.body.categoria || req.query.categoria;

    const {
      titulo,
      descripcion,
      comentarios,
      fechaArchivo,
      nombreArchivo,
      archivoBase64
    } = req.body;

    const nuevaSesion = new CoelSesion({
      tipo,
      categoria,
      titulo,
      descripcion,
      comentarios,
      fechaArchivo,
      nombreArchivo,
      archivoBase64
    });

    const data = await nuevaSesion.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ Error en crearSesion:', error.message);
    res.status(400).json({ success: false, mensaje: error.message || 'Error al guardar la sesión' });
  }
};

const actualizarSesion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tipo,
      categoria,
      titulo,
      descripcion,
      comentarios,
      fechaArchivo,
      nombreArchivo,
      archivoBase64
    } = req.body;

    const updateData = {
      tipo,
      categoria,
      titulo,
      descripcion,
      comentarios,
      fechaArchivo
    };

    // Si se envía un archivo nuevo, se actualiza también
    if (archivoBase64 && nombreArchivo) {
      updateData.archivoBase64 = archivoBase64;
      updateData.nombreArchivo = nombreArchivo;
    }

    const data = await CoelSesion.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!data) {
      return res.status(404).json({ success: false, mensaje: "Registro no encontrado" });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error en actualizarSesion:', error.message);
    res.status(400).json({ success: false, mensaje: error.message || 'Error al actualizar la sesión' });
  }
};

const eliminarSesion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CoelSesion.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({ success: false, mensaje: "Registro no encontrado" });
    }

    res.json({ success: true, mensaje: "Eliminado correctamente" });
  } catch (error) {
    console.error('❌ Error en eliminarSesion:', error.message);
    res.status(500).json({ success: false, mensaje: 'Error al eliminar la sesión' });
  }
};

module.exports = {
  obtenerSesiones,
  crearSesion,
  actualizarSesion,
  eliminarSesion,
};