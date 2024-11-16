# Casino La Fortuna: Sistema de Gestión Integral

## Descripción del Proyecto

**Nuevo enfoque (Octubre 2024)**

Casino La Fortuna es un proyecto de aprendizaje colaborativo desarrollado por William Pérez Muñoz, Hernan Darío Pérez Higuita y Penélope Noreña Ramos como parte del programa ADSO SENA 2758315. Este sistema está diseñado para optimizar la gestión administrativa y financiera de un casino moderno, integrando diversas tecnologías de vanguardia para ofrecer una solución robusta y escalable.

A través de un stack tecnológico que incluye **React**, **Node.js** y **Supabase**, el proyecto ha evolucionado desde su versión inicial en **HTML/CSS** a una **aplicación web full-stack** que soporta múltiples funcionalidades, como el registro y autenticación de usuarios mediante **JWT** y la validación con **reCAPTCHA**. El objetivo es permitir la toma de decisiones informadas basadas en datos precisos y actualizados, mejorando la eficiencia operativa de las actividades del casino.

## Stack Tecnológico

* **Frontend**: React con Bootstrap, para una interfaz de usuario moderna y responsiva.
* **Backend**: Node.js con Express, para un servidor eficiente y escalable.
* **Base de Datos**: Supabase, como solución de base de datos en la nube, con capacidades en tiempo real.
* **Despliegue**:
   * Vercel para el frontend.
   * Render para el backend.
* **Autenticación y Seguridad**: JSON Web Tokens (JWT) para autenticación segura y protección de rutas.
* **Validaciones**: Implementación de reCAPTCHA para prevenir registros automatizados y proteger la seguridad del sistema.
* **Desarrollo y Pruebas**: Postman para realizar pruebas de APIs y asegurar la integridad del backend.

## Funcionalidades Principales

1. **Gestión de Máquinas Tragamonedas**:
   * Registro y seguimiento de actividad por máquina.
   * Control de entradas, salidas y premios mayores.

2. **Gestión de Clientes y Operadores**:
   * Registro de clientes y operadores con validación de datos y seguridad avanzada.
   * Autenticación mediante JWT y manejo seguro de sesiones.
   * Actualización de datos no sensibles por parte del cliente desde el perfil.

3. **Panel de Administración**:
   * Acceso a secciones clave del casino (Contabilidad, Marketing, etc.) con permisos y dashboards personalizados.

4. **Generación de Informes Financieros**:
   * Visualizaciones interactivas de datos financieros que permiten a los administradores tomar decisiones informadas.

5. **Seguridad**:
   * Sistema de autenticación robusto con manejo de tokens JWT para proteger el acceso a la información.
   * Integración de Google reCAPTCHA para validar los registros de nuevos usuarios.

## Proceso de Despliegue

El despliegue del proyecto incluye una integración continua entre el frontend y el backend. Se utiliza **Vercel** para el frontend y **Render** para el backend, mientras que la base de datos en tiempo real es gestionada a través de **Supabase**. Las pruebas se realizan con Postman para verificar la funcionalidad de los endpoints.

1. **Vercel**: Se utiliza para desplegar el frontend, lo que permite que la aplicación React esté disponible para los usuarios.
2. **Render**: Alojamiento del backend Node.js con endpoints seguros y validados mediante Postman.
3. **Supabase**: Gestor de la base de datos en la nube, ofreciendo características como autenticación y reglas de acceso en tiempo real.

## Objetivos de Aprendizaje

* Dominar la creación de aplicaciones web full-stack con tecnologías modernas.
* Implementar seguridad avanzada con JWT y reCAPTCHA.
* Conocer las buenas prácticas de despliegue continuo con herramientas como Vercel y Render.
* Integrar bases de datos en tiempo real utilizando Supabase.
* Mejorar habilidades en diseño de interfaces con React y Bootstrap.
* Practicar la validación de formularios y autenticación de usuarios de manera segura.

Este proyecto es un reflejo del proceso de aprendizaje en la construcción de aplicaciones web escalables, poniendo en práctica conocimientos en frontend y backend, y explorando los desafíos de seguridad y despliegue en la nube.
