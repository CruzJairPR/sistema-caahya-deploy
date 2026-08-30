const CoelSesion = require('../models/CoelSesion');

const obtenerSesiones = async (req, res) => {
  try {
    const { tipo, categoria } = req.query;
    const filtro = {};
    if (tipo) filtro.tipo = tipo;
    if (categoria) filtro.categoria = categoria;

    const data = await CoelSesion.find(filtro).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

const crearSesion = async (req, res) => {
  try {
    const { tipo, categoria, titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

    const nuevaSesion = new CoelSesion({
      tipo,
      categoria,
      titulo,
      descripcion,
      nombreArchivo,
      archivoBase64
    });

    const data = await nuevaSesion.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

const actualizarSesion = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

    const updateData = { titulo, descripcion };
    if (archivoBase64 && nombreArchivo) {
      updateData.archivoBase64 = archivoBase64;
      updateData.nombreArchivo = nombreArchivo;
    }

    const data = await CoelSesion.findByIdAndUpdate(id, updateData, { new: true });
    if (!data) return res.status(404).json({ success: false, mensaje: "Registro no encontrado" });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

const eliminarSesion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CoelSesion.findByIdAndDelete(id);

    if (!data) return res.status(404).json({ success: false, mensaje: "Registro no encontrado" });

    res.json({ success: true, mensaje: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

module.exports = {
  obtenerSesiones,
  crearSesion,
  actualizarSesion,
  eliminarSesion,
};