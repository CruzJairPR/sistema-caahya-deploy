const mongoose = require("mongoose");

const foliosSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true },
        descripcion: { type: String, required: true },
        comentarios: { type: String, default: "" }, // <-- Agregar si lo necesitas separado
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        fechaSubida: { type: Date, default: Date.now },
    },
    { collection: "Control_Folios" }
);

module.exports = mongoose.model("Folios", foliosSchema);