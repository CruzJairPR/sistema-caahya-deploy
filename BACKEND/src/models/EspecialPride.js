const mongoose = require("mongoose");

const EspecialPrideSchema = new mongoose.Schema({
    nombre: { type: String, default: "", trim: true },
    fuente_designacion: { type: String, default: "", trim: true },
    inicio: { type: String, default: "" },
    final: { type: String, default: "" },
    periodo: { type: String, default: "", trim: true },
    observaciones: { type: String, default: "", trim: true }
}, { timestamps: true });

module.exports = mongoose.model("EspecialPride", EspecialPrideSchema, "especial_pride");