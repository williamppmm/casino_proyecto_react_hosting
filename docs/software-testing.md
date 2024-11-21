# Informe de Pruebas de Software - Casino la Fortuna

---
<p align="center">
  <img src="https://i.ibb.co/2hYRgG4/logo.png" alt="Logo Casino la Fortuna" width="300" />
</p>

---

## 1. Información General
- **Proyecto**: Casino la Fortuna
- **Tipo de Documento**: Informe de Pruebas de Software
- **Autores**:
  - Penélope Noreña Ramos
  - Hernan Darío Pérez Higuita
  - William Pérez Muñoz

- **Institución**: Servicio Nacional de Aprendizaje (SENA)  
- **Centro de Formación**: Centro de Gestión de Mercados, Logística y Tecnologías de la Información  
- **Regional**: Distrito Capital  
- **Programa de Formación**: Tecnología en Análisis y Desarrollo de Software  
- **Ficha de Formación**: 2758315  
- **Año**: 2024  

- **Fecha de Inicio**: 29/08/2024  
- **Fecha de Finalización**: 08/10/2024

### 1.1 Propósito del Informe
Este informe documenta el proceso de pruebas de software para garantizar que los módulos funcionales iniciales de Casino la Fortuna cumplan con los requisitos y estándares de calidad, antes de avanzar hacia etapas de desarrollo más complejas.

## Tabla de Contenidos
1. [Información General](#1-información-general)
   - [1-1 Propósito del Informe](#11-propósito-del-informe)

2. [Introducción](#2-introducción)
   - [2.1 Descripción del Proyecto](#21-descripción-del-proyecto)
   - [2.2 Antecedentes del Proyecto](#22-antecedentes-del-proyecto)
   - [2.3 Objetivos del Informe de Pruebas](#23-objetivos-del-informe-de-pruebas)
     - [2.3.1 Objetivos Principales](#231-objetivos-principales)
     - [2.3.2 Objetivos Secundarios](#232-objetivos-secundarios)
   - [2.4 Alcance de las Pruebas](#24-alcance-de-las-pruebas)
   - [2.5 Nota sobre la Funcionalidad de Registro y Login en Producción](#25-nota-sobre-la-funcionalidad-de-registro-y-login-en-producción)

3. [Plan de Pruebas de Software](#3-plan-de-pruebas-de-software)
   - [3.1 Objetivo del Plan de Pruebas](#31-objetivo-del-plan-de-pruebas)
   - [3.2 Objetivos Específicos](#32-objetivos-específicos)
   - [3.3 Objetivo Específico de Usabilidad](#33-objetivo-específico-de-usabilidad)
   - [3.4 Tipos de Pruebas](#34-tipos-de-pruebas)
   - [3.5 Tipos de Pruebas Futuros](#35-tipos-de-pruebas-futuros-planificación)
   - [3.6 Criterios de Aceptación Detallados](#36-criterios-de-aceptación-detallados)
   - [3.7 Cronograma de Pruebas](#37-cronograma-de-pruebas)

4. [Casos de Prueba Detallados](#4-casos-de-prueba-detallados)
   - [4.1 CP001: Navegación entre Páginas Principales](#41-cp001-navegación-entre-páginas-principales)
   - [4.2 CP002: Registro de Nuevo Usuario](#42-cp002-registro-de-nuevo-usuario)
   - [4.3 CP003: Inicio de Sesión y Redirección según Rol](#43-cp003-inicio-de-sesión-y-redirección-según-rol)
   - [4.4 Notas Adicionales](#44-notas-adicionales)

5. [Definición del Ambiente de Prueba](#5-definición-del-ambiente-de-prueba)
   - [5.1 Especificaciones de Hardware](#51-especificaciones-de-hardware)
   - [5.2 Requisitos de Software](#52-requisitos-de-software)
   - [5.3 Dependencias y Herramientas](#53-dependencias-y-herramientas)
   - [5.4 Configuraciones Especiales](#54-configuraciones-especiales)
   - [5.5 Limitaciones del Entorno](#55-limitaciones-del-entorno)

6. [Resultados de los Casos de Prueba](#6-resultados-de-los-casos-de-prueba)
   - [6.1 Registro de Resultados](#61-registro-de-resultados)
   - [6.2 Resumen de Análisis de Resultados](#62-resumen-de-análisis-de-resultados)
   - [6.3 Análisis y Recomendaciones](#63-análisis-y-recomendaciones)
     - [6.3.1 Mejoras Propuestas](#631-mejoras-propuestas)
     - [6.3.2 Siguiente Fase](#632-siguiente-fase)

7. [Conclusiones](#7-conclusiones)
   - [7.1 Logros Alcanzados](#71-logros-alcanzados)
   - [7.2 Consideraciones Futuras](#72-consideraciones-futuras)
   - [7.3 Pasos Siguientes](#73-pasos-siguientes)

8. [Anexos](#8-anexos)

9. [Referencias](#9-referencias)

---

## 2. Introducción

### 2.1 Descripción del Proyecto
Casino la Fortuna es una plataforma web desarrollada para la gestión integral de operaciones de casino, que facilita la interacción entre diferentes tipos de usuarios (clientes y operadores). El sistema implementa una arquitectura moderna basada en React para el frontend y Node.js con Supabase para el backend, garantizando una experiencia de usuario fluida y segura.

Las funcionalidades actualmente implementadas incluyen:
- Sistema de navegación entre páginas informativas
- Registro de usuarios con validación de datos
- Autenticación y control de acceso basado en roles
- Redirección inteligente a dashboards específicos según el rol del usuario

### 2.2 Antecedentes del Proyecto
Este informe aborda la primera fase de pruebas de un sistema de gestión integral para Casino la Fortuna, cuyo objetivo final es administrar todos los aspectos operativos del casino, desde el control de usuarios hasta la generación de reportes financieros. Esta etapa inicial se enfoca en funcionalidades fundamentales de acceso, navegación y autenticación.

### 2.3 Objetivos del Informe de Pruebas

#### 2.3.1 Objetivos Principales
El presente informe tiene como objetivos principales:
1. **Verificar la Funcionalidad**: Asegurar que los componentes implementados funcionan según las especificaciones.
2. **Validar la Seguridad**: Comprobar que el sistema de autenticación y control de acceso opera correctamente.
3. **Evaluar la Usabilidad**: Confirmar que la navegación y la experiencia de usuario son intuitivas y eficientes.

#### 2.3.2 Objetivos Secundarios
1. **Identificar problemas potenciales**: Detectar errores en etapas tempranas para optimizar el proceso de desarrollo y reducir costos de corrección a futuro.
2. **Asegurar la continuidad**: Garantizar que los módulos funcionales no presenten fallos críticos antes de agregar componentes adicionales.
3. **Fomentar la mejora continua**: Proveer una base sólida para futuras iteraciones de pruebas conforme se completen nuevas funcionalidades.

### 2.4 Alcance de las Pruebas

Las pruebas se centrarán en los siguientes módulos:

1. **Navegación entre Páginas Principales**
   - Pruebas de todos los enlaces en la barra de navegación, incluyendo Inicio, Quiénes Somos, Nuestros Juegos, Promociones y Contacto.
   - Validación de la coherencia visual en diferentes resoluciones y navegadores.
   - Verificación de tiempo de carga de cada sección (máximo 3 segundos).

2. **Registro de Usuarios**
   - Pruebas en los campos del formulario: validación de formato de correo, longitud de contraseña, obligatoriedad de los campos.
   - Verificación de mensajes de error o confirmación para datos válidos e inválidos.
   - Confirmación de que el usuario registrado es redirigido correctamente a la página de inicio de sesión.

3. **Autenticación y Redirección según Rol**
   - Pruebas de autenticación con credenciales válidas e inválidas para clientes y operadores.
   - Verificación de la redirección a dashboards según rol, asegurando que cada usuario es llevado al dashboard que le corresponde.
   - Comprobación de persistencia de sesión (token) y manejo de errores en el inicio de sesión.

### 2.5 Nota sobre la Funcionalidad de Registro y Login en Producción

Actualmente, la funcionalidad de **registro** y **login** es totalmente operativa en el entorno de producción y está disponible en [https://casino-la-fortuna.vercel.app/](https://casino-la-fortuna.vercel.app/). Este enlace apunta a la rama `main`, que refleja el despliegue en producción.

#### Estado de los Formularios
En la versión actual en producción, los formularios de **registro** y **login** están implementados como formularios separados para clientes y operadores. Sin embargo, siguiendo las recomendaciones del instructor y con el fin de optimizar la experiencia del usuario, se ha decidido trabajar en una nueva rama (`cambios-registro-login`) para **unificar** ambos formularios en una sola interfaz compartida para ambos roles. Esta unificación está siendo probada en un entorno de desarrollo local para asegurar su estabilidad antes de integrar estos cambios en la rama `main` y desplegarlo nuevamente en producción.

---

## 3. Plan de Pruebas de Software

### 3.1 Objetivo del Plan de Pruebas
Verificar de manera exhaustiva que las funcionalidades implementadas cumplen con los requisitos establecidos, garantizando una experiencia de usuario segura y sin errores.

### 3.2 Objetivos Específicos
1. Verificar la funcionalidad de navegación entre páginas
2. Validar el proceso de registro de usuarios
3. Comprobar el sistema de autenticación y redirección

### 3.3 Objetivo Específico de Usabilidad
1. Asegurar que la interfaz de usuario sea intuitiva y fácil de navegar para todos los perfiles de usuario (cliente, operador).
2. Confirmar que los mensajes de feedback en la interfaz sean claros y útiles en caso de errores.

### 3.4 Tipos de Pruebas
- **Pruebas Funcionales**: Navegación, registro y autenticación
- **Pruebas de Integración**: Flujos completos de usuario
- **Pruebas de Interface**: Validación de UI/UX

### 3.5 Tipos de Pruebas Futuros (Planificación)
- **Pruebas de Seguridad**: Evaluar la protección de datos sensibles en el sistema.
- **Pruebas de Estrés**: Simular múltiples inicios de sesión simultáneos para verificar el rendimiento y estabilidad bajo carga.

### 3.6 Criterios de Aceptación Detallados

1. **Navegación entre páginas**:
   - **Dado** que el usuario está en la página principal,
   - **Cuando** hace clic en un enlace de la barra de navegación,
   - **Entonces** el sistema debe redirigirlo a la sección correcta en menos de 3 segundos.

2. **Registro de usuarios**:
   - **Dado** que el usuario está en el formulario de registro,
   - **Cuando** introduce todos los datos requeridos de manera correcta y acepta los términos,
   - **Entonces** el sistema debe mostrar una confirmación y redirigirlo a la página de inicio de sesión.

3. **Inicio de sesión y redirección por rol**:
   - **Dado** que el usuario ha iniciado sesión,
   - **Cuando** sus credenciales son válidas,
   - **Entonces** el sistema debe redirigirlo al dashboard correspondiente a su rol y mostrar el menú adecuado.

### 3.7 Cronograma de Pruebas

| Etapa de Prueba           | Fecha de Inicio | Fecha de Fin | Objetivo Principal                               |
|--------------------------|-----------------|--------------|--------------------------------------------------|
| Pruebas de Navegación    | 29/08/2024      | 02/09/2024   | Asegurar la funcionalidad y consistencia de UI/UX |
| Pruebas de Registro      | 15/09/2024      | 17/09/2024   | Verificar el proceso de registro y validación de datos |
| Pruebas de Autenticación | 05/10/2024      | 08/10/2024   | Confirmar la autenticación y redirección por rol |

---

## 4. Casos de Prueba Detallados

### 4.1 CP001: Navegación entre Páginas Principales
| Componente | Detalle |
|------------|---------|
| Identificación | CP001 |
| Tipo de prueba | Funcional |
| Nombre del caso | Navegación entre Páginas Principales |
| Descripción | Como usuario, quiero navegar entre las páginas principales del sitio para conocer más sobre el casino |
| Pasos a seguir | 1. Acceder a la página principal (/) <br>2. Hacer clic en "Quiénes Somos" <br>3. Verificar contenido <br>4. Hacer clic en "Nuestros Juegos" <br>5. Verificar contenido <br>6. Hacer clic en "Promociones" <br>7. Verificar contenido <br>8. Hacer clic en "Contacto" <br>9. Verificar contenido |
| Datos de entrada | N/A (navegación por interfaz) |
| Resultado esperado | - Cada enlace debe cargar la página correcta <br>- El contenido debe mostrarse completo y formateado <br>- La barra de navegación debe permanecer accesible <br>- Los tiempos de carga deben ser menores a 3 segundos |
| Criterios de aceptación | **Dado** que soy un usuario en la página principal <br>**Cuando** hago clic en un enlace de navegación <br>**Entonces** debo ser dirigido a la página correspondiente con su contenido completo |
| Fecha de inicio | 29/08/2024 |
| Fecha de fin | 02/09/2024 |
| Responsable | William Perez Muñoz |

### 4.2 CP002: Registro de Nuevo Usuario
| Componente     | Detalle |
|----------------|---------|
| Identificación | CP002 |
| Tipo de prueba | Funcional |
| Nombre del caso | Registro de Nuevo Usuario |
| Descripción | Como visitante, quiero poder registrarme en el sistema para acceder a los servicios del casino |
| Pasos a seguir | 1. Hacer clic en "Registrarse" <br>2. Seleccionar tipo de usuario "Cliente" <br>3. Completar campos obligatorios: <br>&nbsp;&nbsp;- Tipo y número de documento <br>&nbsp;&nbsp;- Nombres y apellidos <br>&nbsp;&nbsp;- Correo electrónico <br>&nbsp;&nbsp;- Contraseña <br>&nbsp;&nbsp;- Teléfono móvil <br>4. Aceptar términos y condiciones <br>5. Completar verificación reCAPTCHA <br>6. Hacer clic en "Registrar" |
| Datos de entrada | {<br> **"tipo_usuario"**: *"Cliente"*,<br> **"tipo_documento"**: *"CC"*,<br> **"numero_documento"**: *"326789802"*,<br> **"fecha_expedicion"**: *"07/05/2015"*,<br> **"genero"**: *"Femenino"*,<br> **"nacionalidad"**: *"Colombia"*,<br> **"fecha_nacimiento"**: *"05/04/1996"*,<br> **"primer_nombre"**: *"Mary"*,<br> **"segundo_nombre"**: *"Luz"*,<br> **"primer_apellido"**: *"Uribe"*,<br> **"segundo_apellido"**: *"Petro"*,<br> **"lugar_expedicion"**: *"Bogotá"*,<br> **"telefono_movil"**: *"3151234567"*,<br> **"correo_electronico"**: *"mary.petro2023@gmail.com"*,<br> **"user_pass"**: *"Mary2024#*"*,<br> **"direccion"**: *"Transversal 15 #17-23 Villa del Lago"*,<br> **"municipio"**: *"Cali"*,<br> **"interdicto"**: *false*,<br> **"pep"**: *false*,<br> **"consentimiento_datos"**: *true*,<br> **"comunicaciones_comerciales"**: *true*,<br> **"terminos_condiciones"**: *true*<br>} |
| Resultado esperado | - Registro exitoso en la base de datos <br>- Mensaje de confirmación mostrado <br>- Redirección a la página de inicio de sesión |
| Criterios de aceptación | **Dado** que soy un visitante <br>**Cuando** completo el formulario con datos válidos <br>**Entonces** debo ser registrado exitosamente y recibir confirmación |
| Fecha de inicio | 15/09/2024 |
| Fecha de fin | 17/09/2024 |
| Responsable | William Perez Muñoz |

### 4.3 CP003: Inicio de Sesión y Redirección según Rol
| Componente     | Detalle |
|----------------|---------|
| Identificación | CP003 |
| Tipo de prueba | Funcional |
| Nombre del caso | Inicio de Sesión y Redirección según Rol |
| Descripción | Como usuario registrado, quiero iniciar sesión y ser redirigido al dashboard correspondiente según mi rol |
| Pasos a seguir | 1. Acceder a la página de inicio de sesión <br>2. Ingresar correo electrónico <br>3. Ingresar contraseña <br>4. Hacer clic en "Ingresar" <br>5. Verificar redirección al dashboard correspondiente |
| Datos de entrada | ***Para cliente:***<br>{<br>  **"correo_electronico"**: *"mary.petro2023@gmail.com"*,<br>  **"user_pass"**: *"Mary2024#"*<br>}<br><br>***Para operador:***<br>{<br> **"correo_electronico"**: *"suarezaleja@hotmail.com"*,<br> **"password"**: *"Perez1980%"*<br>}<br> |
| Resultado esperado | - Cliente: Redirección a /dashboard-cliente <br>- Operador: Redirección a dashboard específico según tipo <br>- Token de sesión generado <br>- Menú actualizado según rol |
| Criterios de aceptación | **Dado** que soy un usuario registrado <br>**Cuando** inicio sesión con credenciales válidas <br>**Entonces** debo ser redirigido al dashboard correspondiente a mi rol |
| Fecha de inicio | 05/10/2024 |
| Fecha de fin | 08/10/2024 |
| Responsable | William Perez Muñoz |

### 4.4 Notas Adicionales

1. **Validaciones de seguridad**:
   - Todas las contraseñas deben cumplir con requisitos mínimos de seguridad
   - El token de sesión debe tener una expiración de 1 hora
   - Las redirecciones deben validar permisos del usuario

2. **Documentación de errores**:
   - Registrar todos los intentos fallidos de inicio de sesión
   - Documentar cualquier error en el proceso de registro
   - Mantener un log de redirecciones fallidas

3. **Consideraciones de UX**:
   - Los mensajes de error deben ser claros y descriptivos
   - El feedback visual debe ser inmediato
   - La navegación debe ser intuitiva y consistente

---

## 5. Definición del Ambiente de Prueba

### 5.1 Especificaciones de Hardware

**Equipo de Desarrollo y Pruebas**
| Componente | Especificación Mínima | Especificación Recomendada |
|------------|----------------------|---------------------------|
| Procesador | Intel Core i5 8a gen | Intel Core i7 10a gen o superior |
| Memoria RAM | 8GB DDR4 | 16GB DDR4 |
| Almacenamiento | 256GB SSD | 512GB SSD |
| Pantalla | 1920x1080 | 2560x1440 |
| Red | 10 Mbps | 50 Mbps o superior |

### 5.2 Requisitos de Software

**Sistema Operativo**
- **Windows**: Windows 10/11 Pro (64-bit)
- **macOS**: Big Sur (11.0) o superior
- **Linux**: Ubuntu 20.04 LTS o superior

**Navegadores**
| Navegador | Versión Mínima | Observaciones |
|-----------|----------------|---------------|
| Google Chrome | 100+ | Navegador principal de desarrollo |
| Mozilla Firefox | 95+ | Pruebas de compatibilidad |
| Microsoft Edge | 95+ | Pruebas adicionales |

**Entorno de Desarrollo**
- **IDE**: Visual Studio Code v1.75 o superior
- **Control de Versiones**: Git 2.35.0 o superior
- **Node.js**: v18.x LTS
- **npm**: v9.x o superior

### 5.3 Dependencias y Herramientas

#### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "axios": "^1.x",
    "bootstrap": "^5.x"
  }
}
```

#### Backend
```json
{
  "dependencies": {
    "express": "^4.x",
    "supabase": "^2.x",
    "jsonwebtoken": "^9.x",
    "bcrypt": "^5.x"
  }
}
```

### 5.4 Configuraciones Especiales

#### Control de Versiones
- Repositorio: GitHub
- Rama de desarrollo: `cambios-registro-login`
- URL del repositorio de pruebas: [https://github.com/williamppmm/casino_proyecto_react_hosting/tree/cambios-registro-login](https://github.com/williamppmm/casino_proyecto_react_hosting/tree/cambios-registro-login)

#### Variables de Entorno
```env
# Backend
SUPABASE_URL=https://tgemcbykzdmsfwadagex.supabase.co
SUPABASE_ANON_KEY=[key]
JWT_SECRET=[secret]
RECAPTCHA_SECRET_KEY=[key]

# Frontend
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_RECAPTCHA_SITE_KEY=[key]
```

#### Extensiones VSCode Requeridas
- ESLint
- Prettier
- React Developer Tools
- Git Lens
- REST Client

### 5.5 Limitaciones del Entorno

#### Entorno de Desarrollo
- Las pruebas se realizaron en la rama `cambios-registro-login` del repositorio
- El código y los resultados de las pruebas están disponibles en: [https://github.com/williamppmm/casino_proyecto_react_hosting/tree/cambios-registro-login](https://github.com/williamppmm/casino_proyecto_react_hosting/tree/cambios-registro-login)

#### Restricciones Técnicas
1. **Base de Datos**:
   - Plan gratuito de Supabase
   - Límite de 500MB de almacenamiento
   - Máximo 50 conexiones concurrentes

2. **Rendimiento**:
   - Tiempo de respuesta puede variar según la carga
   - Limitaciones en el procesamiento concurrente
   - Restricciones de memoria en el servidor

3. **Conectividad**:
   - Requiere conexión estable a Internet
   - Latencia puede afectar tiempos de respuesta
   - VPN puede causar problemas de conexión

#### Compatibilidad
1. **Dispositivos**:
   - Optimizado para desktop
   - Soporte básico para tablets
   - Diseño responsive con limitaciones

2. **Navegadores**:
   - Funcionalidad completa en Chrome
   - Variaciones menores en otros navegadores
   - Sin soporte para IE11

---

## 6. Resultados de los Casos de Prueba

### 6.1 Registro de Resultados

| Prueba | Resultado Real | Resultado Esperado | Estado de la prueba | Defectos |
|--------|---------------|-------------------|---------|----------|
| CP001 | Navegación funciona correctamente en todos los enlaces | Navegación fluida y correcta | ✅ Aprobado | Ninguno |
| CP002 | Registro exitoso con validaciones correctas | Registro y validación correctos | ✅ Aprobado | Ninguno |
| CP003 | Redirección funciona según rol del usuario | Redirección correcta por rol | ✅ Aprobado | Ninguno |

### 6.2 Resumen de Análisis de Resultados
Las pruebas realizadas en los módulos de navegación, registro y autenticación indican que las funcionalidades principales operan de acuerdo con los requisitos establecidos, con un rendimiento adecuado en las pruebas iniciales. No se detectaron defectos críticos que afecten la experiencia del usuario. Los tiempos de carga y redirección fueron satisfactorios, cumpliendo con los criterios de aceptación definidos.
- Las pruebas de navegación muestran un rendimiento óptimo
- El sistema de registro funciona según lo especificado
- La autenticación y redirección operan correctamente

### 6.3 Análisis y Recomendaciones

#### 6.3.1 Mejoras Propuestas
   - Implementar caché para mejorar tiempos de carga.
   - Agregar recuperación de contraseña.
   - Mejorar feedback visual en formularios.

#### 6.3.2 Siguiente Fase
   - Desarrollar pruebas de carga.
   - Implementar pruebas automatizadas.
   - Mejorar cobertura de pruebas.

---

## 7. Conclusiones

### 7.1 Logros Alcanzados
   - Sistema base funcional y estable
   - Pruebas exitosas en funcionalidades críticas
   - Base sólida para futuras implementaciones

### 7.2 Consideraciones Futuras
   - Monitoreo continuo del rendimiento
   - Actualización regular de dependencias
   - Mejora continua de la experiencia de usuario

### 7.3 Pasos Siguientes
   - Implementación de módulos adicionales
   - Expansión de suite de pruebas
   - Optimización de rendimiento

---

## 8. Anexos
### Capturas de los Casos de Prueba

#### CP001: Navegación entre Páginas Principales
<a href="https://ibb.co/NSLFJcZ"><img src="https://i.ibb.co/vYJcT0Z/CP001-Navegaci-n-entre-P-ginas-Principales.png" alt="CP001-Navegación-entre-Páginas-Principales" border="0" width="600"></a>

#### CP002: Registro de Nuevo Usuario
<a href="https://ibb.co/TT5C5CN"><img src="https://i.ibb.co/QcG5G5x/CP002-Registro-de-Nuevo-Usuario.png" alt="CP002-Registro-de-Nuevo-Usuario" border="0"></a>

#### CP003: Inicio de Sesión y Redirección según Rol
<a href="https://ibb.co/MDBK6Ly"><img src="https://i.ibb.co/hRYrfvx/CP003-Inicio-de-Sesi-n-y-Redirecci-n-seg-n-Rol.png" alt="CP003-Inicio-de-Sesi-n-y-Redirecci-n-seg-n-Rol" border="0"></a>

---

## 9. Referencias

1. **Repositorio del Proyecto (Rama de Pruebas)**. Código fuente y pruebas documentadas. [Enlace a la rama de desarrollo](https://github.com/williamppmm/casino_proyecto_react_hosting/tree/cambios-registro-login)
2. **Grabación y resumen conferencia**. Web – Pruebas de Software, SENA, 18 de octubre de 2024. [Ver grabación](https://drive.google.com/file/d/1QjnQ1l_MmMvw_TgKjL4WzWLbMO0fxVi8/view)
3. **Material SENA**. Documento de apoyo para pruebas de software. [Ver documento](https://docs.google.com/document/d/1urydQCK5EwtfHbIorwsklkuVWZ3ehsdf/edit?usp=drive_link&ouid=111275038701467215318&rtpof=true&sd=true)
4. **React Documentation**. Guía oficial de React. [Enlace](https://reactjs.org/docs/getting-started.html)
5. **Supabase API Documentation**. Guía de API de Supabase. [Enlace](https://supabase.io/docs)
6. **JWT Guide**. Introducción al uso de JWT en Node.js. [Enlace](https://jwt.io/introduction/)