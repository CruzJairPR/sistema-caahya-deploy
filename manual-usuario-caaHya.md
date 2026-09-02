# Manual de usuario

# Sistema CAAHyA

## Gestión Académica y Administrativa

Fecha: 01 de septiembre de 2026

---

## 1. Introducción

El sistema CAAHyA es una plataforma web diseñada para la gestión y consulta de información académica y administrativa vinculada con los Consejos Académicos de Área. Su objetivo es centralizar información relacionada con comisiones, planes de estudio, revisiones, sesiones, actas, convocatorias, documentos institucionales y seguimiento de actividades clave.

La aplicación está desarrollada con una arquitectura moderna y consta de:

- Frontend: Next.js + React + Material UI
- Backend: Node.js + Express
- Base de datos: MongoDB
- Seguridad: autenticación con JWT y roles por usuario

El sistema está pensado para facilitar la administración de procesos institucionales, mejorar la organización de la información y controlar el acceso por perfil de usuario.

---

## 2. Objetivo del sistema

La aplicación permite:

- consultar información institucional y académica
- gestionar registros administrativos y académicos
- controlar el acceso según el perfil del usuario
- hacer seguimiento de comisiones, trabajos y actividades
- mantener una base centralizada de información documental
- organizar el flujo de consulta y gestión en los distintos órganos académicos

---

## 3. Usuarios y perfiles

La plataforma cuenta con diferentes perfiles de acceso, cada uno con permisos específicos.

### Perfil 1: Secretaría del Consejo

- consulta y coordinación de asuntos institucionales
- gestión de comisiones y procesos académicos
- acceso a información estratégica del consejo

### Perfil 2: Secretaría Auxiliar 1

- gestión de comisiones dictaminadoras
- revisión de entidades, DGAPA y evaluadoras PRIDE

### Perfil 3: Secretaría Auxiliar 2

- seguimiento de comisiones de lenguas, artes, difusión y comités de carrera
- manejo de instrumentos, convocatorias, sesiones y materiales didácticos

### Perfil 4: Asistente Ejecutiva

- apoyo administrativo
- consulta documental
- tareas operativas con restricciones según el módulo

### Perfil 5: Coordinadora

- control general y acceso a varios módulos para supervisión

---

## 4. Inicio de sesión

Para ingresar al sistema se realiza el siguiente proceso:

1. Abrir la aplicación en el navegador.
2. Seleccionar el perfil del usuario.
3. Ingresar la contraseña correspondiente.
4. Presionar el botón de acceso.

Si los datos son correctos, el sistema:

- valida la credencial
- genera un token JWT
- guarda la sesión en el navegador
- redirige al panel principal (dashboard)

La pantalla de acceso se encarga de autenticar al usuario y redirigirlo según su rol.

---

## 5. Dashboard principal

Una vez autenticado, el usuario entra al dashboard principal. En esta vista se suelen observar:

- bienvenida institucional
- información general del sistema
- accesos rápidos
- navegación según el rol
- alertas y pendientes
- acceso a módulos principales

El dashboard es la pantalla central desde donde el usuario se mueve dentro del sistema.

---

## 6. Barra de navegación

La parte superior de la aplicación incluye una barra de navegación con las siguientes funciones:

- acceso al menú principal
- visualización de notificaciones
- indicador del perfil activo
- cierre de sesión
- acceso al dashboard

La navegación está diseñada para adaptarse al rol del usuario, mostrando únicamente las opciones permitidas para cada perfil.

---

## 7. Menú por perfil

### 7.1 Secretaría del Consejo

Incluye acceso a:

- planes de estudio
- comisiones PRIDE
- actas
- recursos de revisión
- sesiones institucionales

### 7.2 Secretaría Auxiliar 1

Incluye acceso a:

- comisiones dictaminadoras
- directorio de entidades
- evaluadoras PRIDE
- comisiones DGAPA

### 7.3 Secretaría Auxiliar 2

Incluye acceso a:

- comisión especial de lenguas
- instrumentos de evaluación
- revisión de instrumentos
- materiales didácticos
- convocatorias
- sesiones
- subcomisiones
- plan de trabajo
- comités de carrera
- difusión y extensión
- artes

### 7.4 Asistente Ejecutiva

Se enfoca en:

- control de folios
- formatos
- apoyo documental
- tareas operativas
- consulta en módulos institucionales

### 7.5 Coordinadora

Dispone de acceso general y supervisión de varios módulos para coordinación institucional.

---

## 8. Seguridad y control de acceso

La seguridad del sistema se basa en autenticación por token JWT.

Esto significa que:

- el usuario debe iniciar sesión antes de acceder a la información
- cada petición protegida requiere un token válido
- el backend valida la identidad del usuario
- el menú y las opciones se adaptan al rol asignado
- varias pantallas restringen acciones para usuarios con permisos limitados

El sistema valida la sesión mediante middleware del backend antes de permitir el acceso a los módulos.

---

## 9. Flujo de trabajo del sistema

El flujo normal de uso es el siguiente:

1. El usuario inicia sesión.
2. El sistema valida usuario y contraseña.
3. Se genera un token JWT.
4. El navegador guarda la sesión y el rol.
5. El usuario entra al dashboard.
6. El sistema muestra el menú correspondiente a su perfil.
7. El usuario accede al módulo requerido.
8. El backend procesa la petición autenticada.
9. La información se muestra en la interfaz.

---

## 10. Alertas y notificaciones

El sistema incorpora un sistema de alertas y notificaciones para avisar al usuario sobre:

- pendientes
- cambios relevantes
- tareas activas
- acciones importantes del proceso académico

Estas alertas pueden visualizarse desde la barra superior y permiten mantener al usuario informado en tiempo real.

---

## 11. Recomendaciones para usuarios

- Ingresar siempre con el usuario correcto.
- Usar únicamente los módulos permitidos por su perfil.
- Revisar las alertas antes de realizar tareas.
- No modificar información en módulos restringidos.
- Cerrar la sesión al final de cada uso.
- Mantener la contraseña en resguardo y utilizar acceso seguro.

---

## 12. Conclusión

El sistema CAAHyA es una herramienta digital diseñada para apoyar la gestión académica y administrativa de los Consejos Académicos de Área. Su principal valor es centralizar información, controlar acceso por rol, organizar procesos complejos y facilitar la consulta y gestión de documentos y actividades institucionales.

La plataforma es útil para:

- coordinación académica
- seguimiento institucional
- administración documental
- consulta de información
- control de procesos y comisiones

---

## 13. Glosario básico

- Dashboard: pantalla principal del sistema.
- Perfil: rol definido para el usuario.
- JWT: token de autenticación que valida la sesión.
- Módulo: sección funcional del sistema.
- Alerta: notificación de posible pendiente o tarea.
- Sesión: estado autenticado del usuario.

---

## 14. Responsables y soporte

El presente manual sirve como referencia básica para usuarios y administradores del sistema. Se recomienda conservarlo junto con la documentación técnica del proyecto para futuras capacitaciones y mantenimiento del sistema.

---

# Manual técnico y operativo para administración

## 1. Arquitectura

El sistema se compone de:

- frontend para la interfaz y experiencia del usuario
- backend para la autenticación, validación y lógica de negocio
- MongoDB como almacén de datos
- Docker Compose para levantar entorno completo

---

## 2. Servicios principales

El archivo Docker Compose levanta estos servicios:

- MongoDB
- backend
- frontend

Esto permite desarrollar o probar la plataforma en un entorno aislado y replicable.

---

## 3. Base de datos y usuarios

Los usuarios se almacenan en MongoDB y cuentan con:

- username
- password
- role

Los roles permiten controlar acceso y mostrar menús personalizados para cada usuario.

---

## 4. Seguridad

Para proteger la aplicación se utilizan:

- JWT para autenticación
- validación de token por middleware
- password hashing mediante bcrypt
- rutas protegidas en el backend
- permisos por rol en el frontend

---

## 5. Vistas clave del frontend

El frontend está organizado por módulos según el flujo académico y administrativo de la institución. Algunos ejemplos:

- login
- dashboard
- asistentes ejecutivas
- secretaría del consejo
- secretaría auxiliar 1
- secretaría auxiliar 2
- módulos de comités y comisiones

---

## 6. Flujo de funcionamiento del sistema

El flujo operativo real es:

1. Usuario inicia sesión.
2. Backend valida credenciales y genera JWT.
3. Frontend guarda sesión.
4. Se carga el menú según el rol.
5. El usuario consulta o registra información en el módulo correspondiente.
6. El backend procesa la petición autenticada.
7. La respuesta se renderiza en la interfaz.

---

## 7. Recomendaciones administrativas

- Mantener bien definidos los permisos por perfil.
- Revisar que cada usuario tenga el rol correcto.
- Configurar valores seguros para JWT y entorno.
- Revisar logs y errores del backend si falla la autenticación.
- Validar que MongoDB esté disponible antes de levantar servicios.

---

## 8. Problemas frecuentes

### Error de login

Posibles causas:

- usuario inexistente
- contraseña incorrecta
- token no generado
- JWT_SECRET incorrecto

### Menú vacío o inaccesible

Posibles causas:

- falta userRole en localStorage
- falta token
- error en configuración de menú

### Módulos no cargan

Posibles causas:

- backend no responde
- CORS bloqueado
- endpoint sin autenticación o sin permisos

---

## 9. Conclusión

El sistema CAAHyA funciona como una plataforma institucional de gestión académica y documental, diseñada para organizar comisiones, seguimiento académico y tareas operativas bajo control de roles y seguridad.

Es una herramienta útil para:

- apoyo administrativo
- coordinación académica
- gestión documental
- consulta institucional
- control de procesos y seguimiento

---

## 10. Referencia rápida

- Frontend: carpeta FRONTEND
- Backend: carpeta BACKEND
- Base de datos: MongoDB
- Seguridad: JWT
- Roles: Secretaría del Consejo, Secretaría Auxiliar 1, Secretaría Auxiliar 2, Asistente Ejecutiva, Coordinadora

---

## 11. Fin del documento

Este manual ha sido generado con fines de uso y apoyo para la operación del sistema CAAHyA.
