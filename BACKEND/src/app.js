const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const conectarDB = require('./config/db');
const verificarToken = require('./middleware/verificarToken');
const inicializarUsuariosFijos = require('./helpers/seedUsuarios');

// Importación de Rutas
const authRoutes = require('./routes/auth.routes');
// secretaria del consejo
const alertaRoutes = require("./routes/alerta.routes");
const recursoRevisionPrimerPeriodoRoutes = require("./routes/recursoRevisionPrimerPeriodo.routes");
const actasRevisadoraRoutes = require("./routes/actasRevisadora.routes");
const sesionesRevisadoraRoutes = require("./routes/sesionesRevisadora.routes");
const miembroRoutes = require('./routes/miembro.routes');
const especialPrideRoutes = require('./routes/especialPride.route');
const revisadoraPrideRoutes = require('./routes/revisadoraPride.routes');
const comisionEspecialActasRoutes = require("./routes/comisionEspecialActas.routes");
const comisionEspecialSesionesRoutes = require("./routes/comisionEspecialSesiones.routes");
const comisionEspecialRecursosPrimerPeriodoRoutes = require("./routes/comisionEspecialRecursosPrimerPeriodo.routes");
const comisionEspecialRecursosSegundoPeriodoRoutes = require("./routes/comisionEspecialRecursosSegundoPeriodo.routes");
//secretaria auxiliar 1
const recursoRevisionSegundoPeriodoRoutes = require("./routes/recursoRevisionSegundoPeriodo.routes");
const dgapaGeneralRoutes = require('./routes/dgapaGeneral.routes');
const comisionRouter = require('./routes/comision.routes');
const directorioRoutes = require('./routes/directorios.routes');
const evaluadorasPrideRoutes = require('./routes/evaluadorasPride.routes');
//secretaria auxiliar 2
const coelMiembrosRoutes = require('./routes/coelMiembros.routes');
const sesionesArtesRoutes = require("./routes/sesionesArtes.routes");
const sesionesDifusionRoutes = require("./routes/sesionesDifusion.routes");
const carrerasRoutes = require('./routes/carrera.routes');
const crearRutasPlanTrabajo = require('./routes/planTrabajo.routes');
const planTrabajoDifusion = require('./routes/cpdePlanTrabajo.routes');
const planTrabajoArtes = require('./routes/ceaPlanTrabajo.routes');
const revisionIdiomasRoutes = require('./routes/revisionIdiomas.routes');
const coelSesionesRoutes = require('./routes/coelSesiones.routes');
const planTrabajoRoutes = require('./routes/planTrabajo.routes');
const convocatoriasRoutes = require('./routes/convocatorias.routes');
const materialesRoutes = require('./routes/materiales.routes');
const coelIdiomasRoutes = require('./routes/coelIdiomas.routes');
const difusionRoutes = require('./routes/difusion.routes');
const coelRoutes = require('./routes/coel.routes');
const subcomisionLenguasRoutes = require('./routes/coelMiembros.routes');
const planEstudioRoutes = require('./routes/planEstudio.routes');
const planEstudioSuayedRoutes = require('./routes/planEstudioSuayed.routes');
const prideRoutes = require('./routes/pride.routes');
const miembroComisionArtesRoutes = require('./routes/miembroComisionArtes.routes');
const desarrolloGestionRoutes = require('./routes/desarrolloGestion.routes');
const mediaRoutes = require('./routes/media.routes');
const instrumentosEvaluacionRoutes = require('./routes/instrumentosEvaluacion.routes');
//coordinadora
const foliosRoutes = require("./routes/folios.routes");

const app = express();

// 1. Conectamos a la BD y ejecutamos el sembrado automático de forma limpia
conectarDB().then(async () => {
    await inicializarUsuariosFijos();
});

// CONFIGURACIÓN DE CORS
const allowedOrigins = [
    'http://localhost:3000',
    'https://sistema-consultas-l4tln6fdv-cruzjairprs-projects.vercel.app',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const isVercelProject =
            origin.includes('cruzjairprs-projects.vercel.app') ||
            origin.includes('.vercel.app');

        if (allowedOrigins.indexOf(origin) !== -1 || isVercelProject) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por políticas de CORS (Seguridad)'));
        }
    },
    credentials: true,
}));

// Middlewares Globales
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Ruta Health — pública, no está bajo /api/v1
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'Microservicio de Consultas' });
});

// Auth — pública, el login no puede requerir estar logeado
app.use('/api/v1/auth', authRoutes);

// A PARTIR DE AQUÍ, TODO REQUIERE TOKEN VÁLIDO
app.use('/api/v1', verificarToken);

// Registro de Rutas protegidas
app.use('/api/v1/directorios', directorioRoutes);
// secretaria del consejo
app.use("/api/v1/alertas", alertaRoutes);
app.use("/api/v1/recursosRevisionSegundoPeriodo", recursoRevisionSegundoPeriodoRoutes);
app.use("/api/v1/recursosRevisionPrimerPeriodo", recursoRevisionPrimerPeriodoRoutes);
app.use("/api/v1/revisadoraActas", actasRevisadoraRoutes);
app.use("/api/v1/revisadoraSesiones", sesionesRevisadoraRoutes);
app.use('/api/v1/especialPride', especialPrideRoutes);
app.use('/api/v1/revisadoraPride', revisadoraPrideRoutes);
app.use('/api/v1/miembro', miembroRoutes);
app.use("/api/v1/comisionEspecialActas", comisionEspecialActasRoutes);
app.use("/api/v1/comisionEspecialSesiones", comisionEspecialSesionesRoutes);
app.use("/api/v1/comisionEspecialRecursosPrimerPeriodo", comisionEspecialRecursosPrimerPeriodoRoutes);
app.use("/api/v1/comisionEspecialRecursosSegundoPeriodo", comisionEspecialRecursosSegundoPeriodoRoutes);
// secretaria auxiliar 1
app.use('/api/v1/evaluadorasPride', evaluadorasPrideRoutes);
app.use('/api/v1/dgapaGeneral', dgapaGeneralRoutes);
app.use('/api/v1/comisiones', comisionRouter);
app.use('/api/v1/planEstudios', planEstudioRoutes);
app.use('/api/v1/planEstudioSuayed', planEstudioSuayedRoutes);
//secretaria auxiliar 2
app.use('/api/v1/coel-miembros', coelMiembrosRoutes);
app.use("/api/v1/comision-artes/sesiones", sesionesArtesRoutes);
app.use("/api/v1/comision-difusion/sesiones", sesionesDifusionRoutes);
app.use('/api/v1/carreras', carrerasRoutes);
app.use('/api/v1/difusion/plan-trabajo', crearRutasPlanTrabajo('difusion-extension'));
app.use('/api/v1/artes/plan-trabajo', crearRutasPlanTrabajo('comision-especial-artes'));
// Se separó el endpoint para evitar colisión con planTrabajoRoutes
app.use('/api/v1/plan-trabajo-coel', crearRutasPlanTrabajo('plan-trabajo-coel'));
app.use('/api/v1/revision-instrumentos', revisionIdiomasRoutes);
app.use('/api/v1/instrumentos-evaluacion', instrumentosEvaluacionRoutes);
app.use('/api/v1/subcomisionlenguas', coelIdiomasRoutes);
app.use('/api/v1/sesiones', coelSesionesRoutes);
app.use('/api/v1/plan-de-trabajo', planTrabajoRoutes);
app.use('/api/v1/convocatorias', convocatoriasRoutes);
app.use('/api/v1/materiales-didacticos', materialesRoutes);
app.use('/api/v1/subcomisionLenguas', subcomisionLenguasRoutes);
app.use('/api/v1/difusion', difusionRoutes);
app.use('/api/v1/coel', coelRoutes);
app.use('/api/v1/pride', prideRoutes);
app.use('/api/v1/miembroComisionArtes', miembroComisionArtesRoutes);
app.use('/api/v1/desarrolloGestion', desarrolloGestionRoutes);
app.use('/api/v1/media', mediaRoutes);
//coordinadora
app.use("/api/v1/folios", foliosRoutes);

// Inicialización del Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Servicio corriendo en el puerto ${PORT}`);
});