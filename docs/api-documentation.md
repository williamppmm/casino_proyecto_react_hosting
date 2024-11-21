# Documentación API La Fortuna

## Índice
1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
   - [Login](#login)
   - [Verificar Sesión](#verificar-sesión)
3. [Clientes](#clientes)
   - [Obtener Datos del Cliente](#obtener-datos-del-cliente)
4. [Convenciones](#convenciones)
5. [Endpoints](#endpoints)

## Introducción

Esta documentación describe los endpoints disponibles en la API de La Fortuna. Cada endpoint incluye información detallada sobre su uso, parámetros requeridos y respuestas posibles.

## Autenticación

La API utiliza autenticación basada en tokens JWT. Los tokens deben ser incluidos en el header de las peticiones directamente en el campo Authorization, **sin** el prefijo "Bearer":
```
Authorization: <token>
```

**IMPORTANTE**: No incluir el prefijo "Bearer" en el token. El sistema no lo reconoce correctamente y generará errores de autenticación.

### Login

Permite a un usuario (cliente u operador) iniciar sesión en el sistema.

**URL**: `POST http://localhost:5000/api/auth/login-usuario`

**Headers**:
```json
{
    "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
    "correo_electronico": "ejemplo@correo.com",
    "password": "tu_password"
}
```

**Ejemplo de Request**:
```json
{
    "correo_electronico": "llllargentina@hotmail.com",
    "password": "Perez1980%"
}
```

**Respuesta Exitosa (200)**:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tipo": "cliente",
    "nombre": "Luisa Lopez",
    "dashboard_url": "/dashboard-cliente"
}
```

**Campos de la Respuesta**:
- `token`: JWT para autenticar futuras solicitudes
- `tipo`: Rol del usuario (`cliente` u `operador`)
- `nombre`: Nombre completo del usuario
- `dashboard_url`: URL de redirección post-login

**Errores Posibles**:

- **400 Bad Request**:
```json
{
    "error": "Correo y contraseña son requeridos"
}
```
*Causa*: Falta alguno de los campos requeridos en el body.

- **401 Unauthorized**:
```json
{
    "error": "Usuario no encontrado"
}
```
*Causa*: Credenciales inválidas o usuario no registrado.

- **500 Internal Server Error**:
```json
{
    "error": "Error en el proceso de login"
}
```
*Causa*: Error interno del servidor.

## Convenciones

### Formato de Respuestas
Todas las respuestas siguen el siguiente formato base:
- Respuestas exitosas: Objeto JSON con los datos solicitados
- Respuestas de error: Objeto JSON con campo `error` describiendo el problema

### Códigos de Estado HTTP
- 200: Solicitud exitosa
- 400: Error en la solicitud del cliente
- 401: No autorizado
- 403: Prohibido
- 404: Recurso no encontrado
- 500: Error interno del servidor

## Endpoints

### Verificar Sesión

Verifica la validez de un token JWT y devuelve información del usuario.

**URL**: `GET http://localhost:5000/api/auth/verificar-sesion`

**Headers**:
```json
{
    "Authorization": "<tu_token_JWT>"
}
```

**Importante**: No usar el prefijo `Bearer` en el token. El sistema no lo reconoce correctamente.

**Ejemplo de Request**:
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta Exitosa (200)**:
```json
{
    "isValid": true,
    "usuario": {
        "id": 11,
        "tipo": "cliente",
        "email": "llllargentina@hotmail.com",
        "nombre": "Luisa",
        "iat": 1732066380,
        "exp": 1732069980
    }
}
```

**Campos de la Respuesta**:
- `isValid`: Indica si el token es válido
- `usuario`: Objeto con la información decodificada del JWT
  - `id`: Identificador único del usuario
  - `tipo`: Rol del usuario (`cliente` u `operador`)
  - `email`: Correo electrónico del usuario
  - `nombre`: Nombre del usuario
  - `iat`: Timestamp de emisión del token (en segundos)
  - `exp`: Timestamp de expiración del token (en segundos)

**Errores Posibles**:

- **401 Unauthorized**:
```json
{
    "error": "Token inválido"
}
```
*Causa*: Token no válido, expirado o no incluido.

- **400 Bad Request**:
*Causa*: Token mal formado.

**Casos de Prueba Recomendados**:
1. Verificar token válido → Debe retornar `isValid: true`
2. Verificar sin token → Debe retornar error 401
3. Verificar token expirado → Debe retornar error 401
4. Verificar token mal formado → Debe retornar error 400

## Clientes

### Obtener Datos del Cliente

Devuelve los datos personales del cliente autenticado.

**URL**: `GET http://localhost:5000/api/clientes/datos`

**Headers**:
```json
{
    "Authorization": "<tu_token_JWT>"
}
```

**IMPORTANTE**: No incluir el prefijo `Bearer` en el token.

**Ejemplo de Request**:
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta Exitosa (200)**:
```json
{
    "id_cliente": 11,
    "primer_nombre": "Luisa",
    "segundo_nombre": "Liliana",
    "primer_apellido": "Lopez",
    "segundo_apellido": "Lopera",
    "correo_electronico": "llllargentina@hotmail.com",
    "telefono_movil": "3127627263",
    "direccion": "Diagonal 12 # 34-45 La Plat",
    "municipio": "La Plata",
    "fecha_nacimiento": "1999-10-07",
    "nacionalidad": "AR",
    "tipo_documento": "CC",
    "numero_documento": "2344555454",
    "lugar_expedicion": "Rio De La Plata",
    "fecha_expedicion": "2019-03-02",
    "fecha_registro": "2024-11-16T04:36:39.752519"
}
```

**Campos de la Respuesta**:
- `id_cliente`: Identificador único del cliente
- `primer_nombre`, `segundo_nombre`: Nombres del cliente
- `primer_apellido`, `segundo_apellido`: Apellidos del cliente
- `correo_electronico`: Email registrado del cliente
- `telefono_movil`: Número de teléfono del cliente
- `direccion`: Dirección de residencia
- `municipio`: Municipio de residencia
- `fecha_nacimiento`: Fecha de nacimiento del cliente
- `nacionalidad`: Código del país (ISO-3166)
- `tipo_documento`: Tipo de documento (CC, CE, PA)
- `numero_documento`: Número del documento de identificación
- `lugar_expedicion`: Lugar donde fue expedido el documento
- `fecha_expedicion`: Fecha de expedición del documento
- `fecha_registro`: Fecha en que el cliente se registró en el sistema

**Errores Posibles**:

- **401 Unauthorized**:
```json
{
    "error": "Token no proporcionado"
}
```
*Causa*: Token no válido, expirado o no incluido.

- **403 Forbidden**:
```json
{
    "error": "Acceso denegado"
}
```
*Causa*: Token pertenece a un rol que no es cliente.

- **404 Not Found**:
```json
{
    "error": "Cliente no encontrado"
}
```
*Causa*: No se encuentran datos para el cliente autenticado.

- **500 Internal Server Error**:
```json
{
    "error": "Error al obtener datos del cliente"
}
```
*Causa*: Error interno en el servidor.

**Casos de Prueba Recomendados**:
1. Verificar con token válido de cliente → Debe retornar datos del cliente
2. Verificar con token inválido → Debe retornar error 401
3. Verificar con token de operador → Debe retornar error 403
4. Verificar con cliente no existente → Debe retornar error 404

### Actualizar Datos del Cliente

Permite a un cliente actualizar ciertos datos personales específicos.

**URL**: `PUT http://localhost:5000/api/clientes/actualizar`

**Headers**:
```json
{
    "Authorization": "<tu_token_JWT>",
    "Content-Type": "application/json"
}
```

**IMPORTANTE**: No incluir el prefijo `Bearer` en el token.

**Request Body**:
```json
{
    "telefono_movil": "3101234567",
    "direccion": "Carrera 45 #32-21",
    "municipio": "Medellín"
}
```

**Campos Actualizables**:
- `telefono_movil`: Nuevo número de teléfono
- `direccion`: Nueva dirección de residencia
- `municipio`: Nuevo municipio de residencia

**Respuesta Exitosa (200)**:
```json
{
    "id_cliente": 11,
    "fecha_registro": "2024-11-16T04:36:39.752519",
    "tipo_documento": "CC",
    "numero_documento": "2344555454",
    "fecha_expedicion": "2019-03-02",
    "primer_nombre": "Luisa",
    "segundo_nombre": "Liliana",
    "primer_apellido": "Lopez",
    "segundo_apellido": "Lopera",
    "lugar_expedicion": "Rio De La Plata",
    "correo_electronico": "llllargentina@hotmail.com",
    "telefono_movil": "3101234567",
    "fecha_nacimiento": "1999-10-07",
    "genero": "O",
    "nacionalidad": "AR",
    "direccion": "Carrera 45 #32-21",
    "municipio": "Medellín",
    "interdicto": false,
    "pep": false,
    "consentimiento_datos": true,
    "comunicaciones_comerciales": true,
    "terminos_condiciones": true
}
```

**Errores Posibles**:

- **401 Unauthorized**:
```json
{
    "error": "Token no proporcionado"
}
```
*Causa*: Token no válido, expirado o no incluido.

- **403 Forbidden**:
```json
{
    "error": "Acceso denegado"
}
```
*Causa*: Token pertenece a un rol que no es cliente.

- **400 Bad Request**:
```json
{
    "error": "Datos inválidos para actualizar"
}
```
*Causa*: Se intentó actualizar campos no permitidos o body vacío.

- **500 Internal Server Error**:
```json
{
    "error": "Error al actualizar datos del cliente"
}
```
*Causa*: Error interno en el servidor.

**Casos de Prueba Recomendados**:
1. Actualizar datos permitidos → Debe retornar datos actualizados
2. Intentar actualizar campos no permitidos → Debe retornar error 400
3. Verificar con token inválido → Debe retornar error 401
4. Verificar con token de operador → Debe retornar error 403

### Cerrar Sesión

Permite cerrar la sesión del usuario actual. El token debe ser eliminado en el frontend.

**URL**: `POST http://localhost:5000/api/auth/logout`

**Headers**:
```json
{
    "Authorization": "<tu_token_JWT>"
}
```

**IMPORTANTE**: No incluir el prefijo `Bearer` en el token.

**Respuesta Exitosa (200)**:
```json
{
    "message": "Sesión cerrada exitosamente"
}
```

**Errores Posibles**:

- **401 Unauthorized**:
```json
{
    "error": "Token inválido"
}
```
*Causa*: Token no válido, expirado o no incluido.

**Casos de Prueba Recomendados**:
1. Verificar con token válido → Debe retornar mensaje de éxito
2. Verificar sin token → Debe retornar error 401
3. Verificar con token de cualquier rol → Debe funcionar igual

**Notas Importantes**:
- Sistema stateless: el token no se invalida en el backend
- La eliminación del token debe manejarse en el frontend (localStorage/sessionStorage)
- Este endpoint es compatible con todos los roles de usuario

### Registro de Cliente

Permite registrar un nuevo cliente en el sistema, incluyendo la validación de reCAPTCHA.

**URL**: `POST http://localhost:5000/api/registro-usuario`

**Headers**:
```json
{
    "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
    "tipo_documento": "CC",
    "numero_documento": "25346876",
    "fecha_expedicion": "2010-11-07",
    "primer_nombre": "Juan",
    "segundo_nombre": "Carlos",
    "primer_apellido": "Pérez",
    "segundo_apellido": "López",
    "lugar_expedicion": "Bogotá",
    "correo_electronico": "juanperez2022@gmail.com",
    "telefono_movil": "310546299",
    "user_pass": "Perez1980%",
    "fecha_nacimiento": "1990-05-27",
    "genero": "M",
    "nacionalidad": "CO",
    "direccion": "Carrera 45 #32-21 Las Palmas",
    "municipio": "Bogotá",
    "tipo_usuario": "Cliente",
    "interdicto": false,
    "pep": false,
    "consentimiento_datos": true,
    "comunicaciones_comerciales": true,
    "terminos_condiciones": true,
    "recaptcha": "03AFcWeA6_4zT7Zhe_Ui5VwZvkA_9EENszgbrC2CAKP7uxFlnAdVUkGm6AtijEMz..."
}
```

**IMPORTANTE**: El token de reCAPTCHA debe obtenerse completando el reCAPTCHA en el frontend:
1. Acceder a `http://localhost:3000/registro-usuario`
2. Completar el reCAPTCHA
3. Capturar el token generado usando las herramientas de desarrollo (F12)

**Respuesta Exitosa (201 Created)**:
```json
{
    "message": "Usuario registrado exitosamente",
    "usuario": {
        "id_cliente": 12,
        "fecha_registro": "2024-11-20T03:20:36.440726",
        "tipo_documento": "CC",
        "numero_documento": "25346876",
        "fecha_expedicion": "2010-11-07",
        "primer_nombre": "Juan",
        "segundo_nombre": "Carlos",
        "primer_apellido": "Pérez",
        "segundo_apellido": "López",
        "lugar_expedicion": "Bogotá",
        "correo_electronico": "juanperez2022@gmail.com",
        "telefono_movil": "310546299",
        "user_pass": "$2b$10$Djr7RYFLnUhAxV6qXdS5y.5rhbFX9wu5nyG0oT0VsK1TTo66s.9le",
        "fecha_nacimiento": "1990-05-27",
        "genero": "M",
        "nacionalidad": "CO",
        "direccion": "Carrera 45 #32-21 Las Palmas",
        "municipio": "Bogotá",
        "interdicto": false,
        "pep": false,
        "consentimiento_datos": true,
        "comunicaciones_comerciales": true,
        "terminos_condiciones": true
    }
}
```

**Errores Posibles**:

- **400 Bad Request**:
```json
{
    "error": "Verificación de reCAPTCHA fallida"
}
```
*Causa*: Token de reCAPTCHA inválido o expirado.

```json
{
    "error": "Datos no válidos para el registro."
}
```
*Causa*: Faltan campos obligatorios o datos con formato incorrecto.

- **500 Internal Server Error**:
```json
{
    "error": "Error en el proceso de registro.",
    "details": "Mensaje detallado del error"
}
```
*Causa*: Error interno en el servidor durante el proceso de registro.

**Casos de Prueba Recomendados**:
1. Registro con todos los datos válidos y reCAPTCHA → Debe retornar 201 y datos del usuario
2. Registro sin reCAPTCHA → Debe retornar error 400
3. Registro con datos incompletos → Debe retornar error 400
4. Registro con correo ya existente → Debe retornar error apropiado

### Registro de Operador

Permite registrar un nuevo operador en el sistema, requiriendo un código de autorización válido y verificación reCAPTCHA.

**URL**: `POST http://localhost:5000/api/registro-usuario`

**Headers**:
```json
{
    "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
    "tipo_documento": "CC",
    "numero_documento": "34567890",
    "fecha_expedicion": "2015-03-12",
    "primer_nombre": "Maria",
    "segundo_nombre": "Fernanda",
    "primer_apellido": "Gomez",
    "segundo_apellido": "Lopez",
    "lugar_expedicion": "Medellín",
    "correo_electronico": "mariafernanda.fortunaoperador@gmail.com",
    "telefono_movil": "3105674321",
    "user_pass": "Perez1980%",
    "fecha_nacimiento": "1987-09-12",
    "genero": "F",
    "nacionalidad": "CO",
    "direccion": "Carrera 25 #12-34",
    "municipio": "Medellín",
    "tipo_usuario": "Operador",
    "cargo": "Cajera",
    "fecha_ingreso": "2024-11-20",
    "codigo_autorizacion": "AUTH6789",
    "recaptcha": "03AFcWeA49szz-JELIBtHJNP29gtRCl..."
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
    "message": "Usuario registrado exitosamente",
    "usuario": {
        "id_operador": 4,
        "id_seccion": 7,
        "cargo": "Cajera",
        "fecha_ingreso": "2024-11-20",
        "tipo_documento": "CC",
        "numero_documento": "34567890",
        "fecha_expedicion": "2015-03-12",
        "primer_nombre": "Maria",
        "segundo_nombre": "Fernanda",
        "primer_apellido": "Gomez",
        "segundo_apellido": "Lopez",
        "lugar_expedicion": "Medellín",
        "correo_electronico": "mariafernanda.fortunaoperador@gmail.com",
        "telefono_movil": "3105674321",
        "direccion": "Carrera 25 #12-34",
        "user_pass": "$2b$10$zbqWMLYeP/XqFIEF.jyDVe/jehxv/J22IZdEppSESO4m0udgHdw2q",
        "fecha_nacimiento": "1987-09-12",
        "genero": "F",
        "nacionalidad": "CO",
        "municipio": "Medellín",
        "id_autorizacion": 7
    }
}
```

**Errores Posibles**:

- **400 Bad Request** (Código de Autorización No Válido):
```json
{
    "error": "Código de autorización no válido."
}
```
*Causa*: El código de autorización proporcionado no existe o no es válido.

- **400 Bad Request** (Código Ya Utilizado):
```json
{
    "error": "Código de autorización ya utilizado."
}
```
*Causa*: El código de autorización ya fue usado en un registro previo.

- **400 Bad Request** (Campos Incorrectos):
```json
{
    "error": "Faltan campos obligatorios para el registro de operador."
}
```
*Causa*: No se proporcionaron todos los campos requeridos o tienen formato incorrecto.

- **400 Bad Request** (reCAPTCHA Inválido):
```json
{
    "error": "Verificación de reCAPTCHA fallida."
}
```
*Causa*: Token de reCAPTCHA inválido o expirado.

- **500 Internal Server Error**:
```json
{
    "error": "Error interno del servidor.",
    "details": "Mensaje detallado del error"
}
```
*Causa*: Error interno durante el proceso de registro.

**Notas Importantes**:
- El token de reCAPTCHA debe obtenerse desde la interfaz de usuario antes de realizar la solicitud
- Los códigos de autorización son de un solo uso; una vez utilizados, su estado cambia a FALSE
- Todos los campos mostrados en el ejemplo son obligatorios para el registro de operadores

**Casos de Prueba Recomendados**:
1. Registro con código de autorización válido → Debe retornar 201 y datos del operador
2. Registro con código ya utilizado → Debe retornar error 400
3. Registro sin código de autorización → Debe retornar error 400
4. Registro con reCAPTCHA inválido → Debe retornar error 400

### Verificar Código de Autorización

Verifica la validez de un código de autorización y retorna la URL del dashboard asociado.

**URL**: `GET /api/registro/verificar-autorizacion/:codigo`

**Parámetros de Ruta**:
- `:codigo` - Código de autorización a verificar

**Respuesta Exitosa (200)**:
```json
{
    "dashboard_url": "/sports-betting-dashboard"
}
```

**Errores Posibles**:

- **400 Bad Request** (Código No Válido):
```json
{
    "error": "Código de autorización no válido."
}
```
*Causa*: El código proporcionado no existe en el sistema.

- **400 Bad Request** (Código Ya Utilizado):
```json
{
    "error": "Código de autorización ya utilizado."
}
```
*Causa*: El código existe pero ya fue utilizado previamente.

**Casos de Prueba Recomendados**:
1. Verificar código válido → Debe retornar URL del dashboard
2. Verificar código inexistente → Debe retornar error de código no válido
3. Verificar código ya usado → Debe retornar error de código utilizado

### Obtener Datos del Operador

Permite obtener la información completa de un operador autenticado, incluyendo datos personales y de sección.

**URL**: `GET http://localhost:5000/api/operadores/datos`

**Headers**:
```json
{
    "Authorization": "<token_JWT>"
}
```

**IMPORTANTE**: No incluir el prefijo `Bearer` en el token.

**Respuesta Exitosa (200)**:
```json
{
    "id_operador": 1,
    "primer_nombre": "WILLIAM",
    "segundo_nombre": "",
    "primer_apellido": "PEREZ",
    "segundo_apellido": "MUÑOZ",
    "correo_electronico": "williamperez_admin@casinofortuna.com",
    "telefono_movil": "3152728882",
    "direccion": "Carrera 25 #42A-20",
    "municipio": "POPAYAN",
    "fecha_nacimiento": "1980-05-15",
    "nacionalidad": "CO",
    "tipo_documento": "CC",
    "numero_documento": "10291778",
    "lugar_expedicion": "POPAYAN",
    "fecha_expedicion": "1999-08-13",
    "cargo": "Super Administrador",
    "fecha_ingreso": "2023-01-01",
    "seccion": {
        "id_seccion": 1,
        "dashboard_url": "/admin-dashboard",
        "nombre_seccion": "ADMINISTRACION"
    }
}
```

**Errores Posibles**:

- **401 Unauthorized** (Token No Proporcionado):
```json
{
    "error": "Token no proporcionado"
}
```
*Causa*: No se incluyó el token JWT en el header.

- **401 Unauthorized** (Token Inválido):
```json
{
    "error": "Token inválido"
}
```
*Causa*: El token proporcionado no es válido o está expirado.

- **403 Forbidden** (Acceso Denegado):
```json
{
    "error": "Acceso denegado"
}
```
*Causa*: El usuario autenticado no es de tipo "operador".

- **404 Not Found** (Operador No Encontrado):
```json
{
    "error": "Operador no encontrado"
}
```
*Causa*: No se encontraron datos para el operador autenticado.

- **500 Internal Server Error**:
```json
{
    "error": "Error al obtener datos del operador"
}
```
*Causa*: Error interno en el servidor.

**Validaciones**:
- El token JWT debe contener el `id` y `tipo` del usuario
- Solo usuarios tipo `operador` tienen acceso
- El operador debe existir en la base de datos

**Ejemplo de Flujo Completo**:

1. Primero, obtener token mediante login:
```http
POST http://localhost:5000/api/auth/login-usuario
Content-Type: application/json

{
    "correo_electronico": "williamperez_admin@casinofortuna.com",
    "password": "TuContraseña"
}
```

2. Usar el token recibido para obtener datos:
```http
GET http://localhost:5000/api/operadores/datos
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Casos de Prueba Recomendados**:
1. Obtener datos con token válido de operador → Debe retornar datos completos
2. Intentar acceder sin token → Debe retornar error 401
3. Intentar acceder con token de cliente → Debe retornar error 403
4. Intentar acceder con token inválido → Debe retornar error 401

### Solicitar Recuperación de Contraseña

Genera un token de recuperación de contraseña y envía un correo electrónico con un enlace para restablecerla.

**URL**: `POST http://localhost:5000/api/auth/recuperar-password`

**Headers**:
```json
{
    "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
    "correo_electronico": "ejemplo@correo.com",
    "recaptcha": "03AFcWeA6_4zT7Zhe_Ui5VwZvkA_9EENszgbrC2CAKP7uxFlnAdVUkGm..."
}
```

**IMPORTANTE**: El token de reCAPTCHA debe obtenerse completando el reCAPTCHA en el frontend.

**Respuesta Exitosa (200)**:
```json
{
    "message": "Se ha enviado un correo con instrucciones para restablecer tu contraseña"
}
```

**Errores Posibles**:

- **400 Bad Request** (reCAPTCHA Inválido):
```json
{
    "error": "Verificación de reCAPTCHA fallida"
}
```
*Causa*: Token de reCAPTCHA inválido o expirado.

- **404 Not Found**:
```json
{
    "error": "No se encontró una cuenta asociada a este correo electrónico"
}
```
*Causa*: El correo proporcionado no está registrado en el sistema.

- **429 Too Many Requests**:
```json
{
    "error": "Demasiadas solicitudes. Por favor, espera 15 minutos antes de intentar nuevamente"
}
```
*Causa*: Se han realizado múltiples intentos de recuperación para el mismo correo.

- **500 Internal Server Error**:
```json
{
    "error": "Error al procesar la solicitud de recuperación"
}
```
*Causa*: Error interno del servidor al procesar la solicitud.

### Verificar Token de Recuperación

Verifica la validez de un token de recuperación de contraseña.

**URL**: `GET http://localhost:5000/api/auth/verificar-token-recuperacion/:token`

**Parámetros de Ruta**:
- `:token` - Token de recuperación recibido por correo

**Respuesta Exitosa (200)**:
```json
{
    "valid": true,
    "correo_electronico": "ejemplo@correo.com"
}
```

**Errores Posibles**:

- **400 Bad Request**:
```json
{
    "error": "Token inválido o expirado"
}
```
*Causa*: El token no existe, ya fue utilizado o ha expirado.

### Restablecer Contraseña

Permite al usuario establecer una nueva contraseña utilizando un token de recuperación válido.

**URL**: `POST http://localhost:5000/api/auth/restablecer-password`

**Headers**:
```json
{
    "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "nueva_password": "NuevaContraseña123%",
    "confirmar_password": "NuevaContraseña123%"
}
```

**Validaciones de Contraseña**:
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial
- Las contraseñas deben coincidir

**Respuesta Exitosa (200)**:
```json
{
    "message": "Contraseña actualizada exitosamente"
}
```

**Errores Posibles**:

- **400 Bad Request** (Token Inválido):
```json
{
    "error": "Token inválido o expirado"
}
```
*Causa*: El token no existe, ya fue utilizado o ha expirado.

- **400 Bad Request** (Contraseña Inválida):
```json
{
    "error": "La contraseña no cumple con los requisitos de seguridad"
}
```
*Causa*: La nueva contraseña no cumple con las validaciones requeridas.

- **400 Bad Request** (Contraseñas No Coinciden):
```json
{
    "error": "Las contraseñas no coinciden"
}
```
*Causa*: Los campos `nueva_password` y `confirmar_password` son diferentes.

- **500 Internal Server Error**:
```json
{
    "error": "Error al actualizar la contraseña"
}
```
*Causa*: Error interno del servidor al actualizar la contraseña.

**Notas de Implementación Frontend**:

1. **Página de Solicitud de Recuperación**:
   - Implementar reCAPTCHA v2
   - Mostrar mensaje de éxito indicando revisar el correo
   - Implementar límite de intentos por dirección IP
   - Validar formato de correo electrónico

2. **Página de Restablecimiento de Contraseña**:
   - Validar token en la URL al cargar la página
   - Implementar validaciones en tiempo real de la contraseña
   - Mostrar indicador de fortaleza de contraseña
   - Redireccionar a login tras éxito

**Ejemplos de Pruebas en Postman**:

1. **Solicitar Recuperación**:
```http
POST http://localhost:5000/api/auth/recuperar-password
Content-Type: application/json

{
    "correo_electronico": "usuario@ejemplo.com",
    "recaptcha": "03AFcWeA6_4zT7Zhe_Ui5VwZvkA_9EENszgbrC2CAKP7uxFlnAdVUkGm..."
}
```

2. **Verificar Token**:
```http
GET http://localhost:5000/api/auth/verificar-token-recuperacion/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Restablecer Contraseña**:
```http
POST http://localhost:5000/api/auth/restablecer-password
Content-Type: application/json

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "nueva_password": "NuevaContraseña123%",
    "confirmar_password": "NuevaContraseña123%"
}
```

**Casos de Prueba Recomendados**:

1. Flujo Exitoso:
   - Solicitar recuperación → Recibir correo
   - Verificar token válido → Obtener confirmación
   - Restablecer contraseña → Login exitoso

2. Casos de Error:
   - Solicitud sin reCAPTCHA
   - Correo no registrado
   - Token expirado o inválido
   - Contraseña que no cumple requisitos
   - Contraseñas que no coinciden
   - Múltiples intentos de recuperación

# Verificar Token de Recuperación

Este endpoint se utiliza para validar si un token de recuperación de contraseña es válido (no expirado, no usado, y existente).

## Información General

- **Método:** `GET`
- **URL:** `http://localhost:5000/api/auth/verificar-token-reset/:token`

## Parámetros

### Parámetros de URL
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `:token` | string | Token único generado durante el proceso de recuperación de contraseña |

## Respuestas

### Respuesta Exitosa
**Código:** 200 OK
```json
{
    "valid": true
}
```

### Errores Posibles

#### Token Inválido o Expirado
**Código:** 400 Bad Request
```json
{
    "error": "Token inválido o expirado."
}
```

#### Error del Servidor
**Código:** 500 Internal Server Error
```json
{
    "error": "Error al verificar el token."
}
```

## Implementación del Controlador

```javascript
exports.verificarTokenRecuperacion = async (req, res) => {
    const { token } = req.params;
    
    try {
        const { data: tokenValido, error } = await supabase
            .from('password_resets')
            .select('id_cliente, id_operador, expires_at, used')
            .eq('token', token)
            .single();

        if (!tokenValido || error || tokenValido.used || new Date(tokenValido.expires_at) < new Date()) {
            return res.status(400).json({ 
                error: 'Token inválido o expirado.' 
            });
        }

        res.json({ valid: true });
        
    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(500).json({ 
            error: 'Error al verificar el token.' 
        });
    }
};
```

## Ejemplo de Uso en Postman

### Request
```http
GET http://localhost:5000/api/auth/verificar-token-reset/546c31b645be33aafe9c49f00eac0e63dadf222902cd34cbd80ad638b39410f2
```

### Respuestas Posibles

#### Éxito
```json
{
    "valid": true
}
```

#### Error
```json
{
    "error": "Token inválido o expirado."
}
```

## Casos de Prueba

1. **Token Válido**
   - Token existente
   - No usado previamente
   - Dentro del tiempo de expiración
   - Resultado esperado: `{ "valid": true }`

2. **Token Expirado**
   - Token existente pero fuera del tiempo de validez
   - Resultado esperado: Error 400

3. **Token Ya Utilizado**
   - Token existente pero marcado como usado
   - Resultado esperado: Error 400

4. **Token Inexistente**
   - Token que no existe en la base de datos
   - Resultado esperado: Error 400

5. **Token Malformado**
   - Token con formato incorrecto
   - Resultado esperado: Error 400

## Notas de Implementación

- El endpoint verifica el token contra la tabla `password_resets` en la base de datos
- Se realizan múltiples validaciones:
  - Existencia del token en la base de datos
  - Verificación de uso previo
  - Validación de fecha de expiración
- La respuesta es minimalista para mantener la seguridad
- No se devuelve información sensible en caso de error

## Seguridad

- No se revelan detalles específicos sobre la razón del fallo
- Todas las validaciones se realizan en el servidor
- Se utiliza un token suficientemente largo y aleatorio
- Se implementa expiración temporal de tokens

# Cambiar Contraseña

Endpoint para restablecer la contraseña de un usuario utilizando un token de recuperación.

## Información General

- **Método:** `POST`
- **URL:** `http://localhost:5000/api/auth/cambiar-password`
- **Content-Type:** `application/json`

## Request

### Headers
```json
{
    "Content-Type": "application/json"
}
```

### Body
```json
{
    "token": "97f043bec5d447ea6616c1257ca7c3d1360b4888a89141c4a69608f071af0d09",
    "nueva_password": "Maleja1980%",
    "confirmar_password": "Maleja1980%"
}
```

### Campos Requeridos
| Campo | Tipo | Descripción | Validaciones |
|-------|------|-------------|--------------|
| `token` | string | Token de recuperación recibido por correo | - Debe ser válido y no expirado |
| `nueva_password` | string | Nueva contraseña | - Mínimo 8 caracteres<br>- Al menos una mayúscula<br>- Al menos una minúscula<br>- Al menos un número<br>- Al menos un carácter especial |
| `confirmar_password` | string | Confirmación de la nueva contraseña | - Debe coincidir con nueva_password |

## Respuestas

### Respuesta Exitosa
**Código:** 200 OK
```json
{
    "message": "Contraseña actualizada exitosamente."
}
```

### Errores Posibles

#### Contraseñas No Coinciden
**Código:** 400 Bad Request
```json
{
    "error": "Las contraseñas no coinciden."
}
```

#### Token Inválido o Expirado
**Código:** 400 Bad Request
```json
{
    "error": "Token inválido o expirado."
}
```

#### Error al Actualizar
**Código:** 500 Internal Server Error
```json
{
    "error": "Error al actualizar la contraseña."
}
```

#### Error del Servidor
**Código:** 500 Internal Server Error
```json
{
    "error": "Error al restablecer la contraseña."
}
```

## Ejemplo de Uso en Postman

### Request
```http
POST http://localhost:5000/api/auth/cambiar-password
Content-Type: application/json

{
    "token": "97f043bec5d447ea6616c1257ca7c3d1360b4888a89141c4a69608f071af0d09",
    "nueva_password": "Maleja1980%",
    "confirmar_password": "Maleja1980%"
}
```

## Casos de Prueba

1. **Cambio Exitoso**
   - Token válido
   - Contraseñas coinciden y cumplen requisitos
   - Resultado esperado: 200 OK

2. **Contraseñas No Coinciden**
   - Token válido
   - Contraseñas diferentes
   - Resultado esperado: Error 400

3. **Token Inválido**
   - Token expirado o ya usado
   - Resultado esperado: Error 400

4. **Contraseña Débil**
   - No cumple requisitos de seguridad
   - Resultado esperado: Error 400

## Notas de Implementación

- El token se invalida después de un uso exitoso
- Existe un límite de tiempo para usar el token
- Las contraseñas se hashean antes de almacenarse
- Se verifican múltiples condiciones de seguridad

## Validaciones de Contraseña

La nueva contraseña debe cumplir:
- Longitud mínima de 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial (!@#$%^&*)

CONTINUA LOS ENDPOINTS DE RECUPERACION DE CONTRASEÑAS, PRUEBAS POSTMAN HE IMPLEMENTACION EN EL FRONTEND