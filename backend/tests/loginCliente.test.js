const request = require('supertest'); // Importar supertest para hacer solicitudes HTTP
const app = require('../index'); // Importar la aplicación que exportaste en index.js

describe('Pruebas del API', () => {
  it('Debería devolver un token al iniciar sesión', async () => {
    const res = await request(app)
      .post('/api/clientes/login-cliente')
      .send({
        correo_electronico: 'johnaper@hotmail.com',
        user_pass: 'Perez1980'
      });

    console.log('Respuesta:', res.body); // Agregar para ver la respuesta
    console.log('Código de estado:', res.statusCode);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});