const mongoose = require("mongoose");

const PlanEstudioSchema = new mongoose.Schema({
  licenciatura: {
    type: String,
    required: false,
    default: "",
    trim: true
  },
  entidad: {
    type: String,
    required: false,
    default: "",
    trim: true
  },
  creacion_implantacion: {
    type: String,
    default: ""
  },
  modificacion: {
    type: String,
    default: ""
  },
  evaluacion: {
    type: String,
    default: ""
  },
  adecuacion_temas_emergentes: {
    type: String,
    default: ""
  },
  adecuacion_titulacion: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("PlanEstudio", PlanEstudioSchema, "planEstudios");