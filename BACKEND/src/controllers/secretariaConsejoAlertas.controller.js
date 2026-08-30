const ComisionEspecialMiembros = require("../models/EspecialPride");
const ComisionRevisoraMiembros = require("../models/RevisadoraPride");

const obtenerResumenAlertas = async (req, res) => {
    try {
        const hoy = new Date();

        const evaluarUrgenciaGlobal = (registros) => {
            let criticos = 0;    // <= 3 meses (Rojo)
            let advertencias = 0; // > 3 meses y <= 6 meses (Amarillo)
            let vencidos = 0;     // < 0 días

            registros.forEach(item => {
                if (!item.fechaTermino) return;
                const termino = new Date(item.fechaTermino);
                if (isNaN(termino.getTime())) return;

                const diffTime = termino.getTime() - hoy.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                const diffMonths = diffDays / 30;

                if (diffDays < 0) {
                    vencidos++;
                } else if (diffMonths <= 3) {
                    criticos++;
                } else if (diffMonths <= 6) {
                    advertencias++;
                }
            });

            return { vencidos, criticos, advertencias };
        };

        const [miembrosEspecial, miembrosRevisora] = await Promise.all([
            ComisionEspecialMiembros.find(),
            ComisionRevisoraMiembros.find()
        ]);

        res.status(200).json({
            success: true,
            data: {
                comisionEspecial: evaluarUrgenciaGlobal(miembrosEspecial),
                comisionRevisora: evaluarUrgenciaGlobal(miembrosRevisora)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { obtenerResumenAlertas };