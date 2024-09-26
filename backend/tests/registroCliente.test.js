const request = require('supertest');
const app = require('../index'); // Aquí importamos la aplicación de Express
const { createClient } = require('@supabase/supabase-js');

// Mockear la función createClient para que no interactúe con la base de datos en las pruebas
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({ data: [], error: null }),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { id_cliente: 1 }, error: null }),
  })),
}));

describe('POST /api/clientes/registro-cliente', () => {
  it('debería registrar un cliente exitosamente', async () => {
    const newClient = {
      tipo_documento: "CC",
      numero_documento: "1234567890",
      fecha_expedicion: "2020-01-01",
      primer_nombre: "Juan",
      segundo_nombre: "Carlos",
      primer_apellido: "Pérez",
      segundo_apellido: "Muñoz",
      lugar_expedicion: "Bogotá",
      correo_electronico: "juan@example.com",
      telefono_movil: "3111234567",
      user_pass: "Password123!",
      fecha_nacimiento: "1990-01-01",
      genero: "M",
      nacionalidad: "CO",
      direccion: "Calle 123",
      municipio: "Bogotá",
      interdicto: false,
      pep: false,
      consentimiento_datos: true,
      comunicaciones_comerciales: true,
      terminos_condiciones: true
    };

    const response = await request(app)
      .post('/api/clientes/registro-cliente')
      .send(newClient);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Cliente registrado exitosamente');
    expect(response.body).toHaveProperty('id_cliente');
  });

  it('debería devolver un error si el cliente ya existe', async () => {
    // Mockear la función select para devolver un cliente existente
    createClient.mockImplementationOnce(() => ({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({ data: [{ id_cliente: 1 }], error: null }),
    }));

    const existingClient = {
      tipo_documento: "CC",
      numero_documento: "1234567890",
      correo_electronico: "juan@example.com",
      user_pass: "Password123!"
    };

    const response = await request(app)
      .post('/api/clientes/registro-cliente')
      .send(existingClient);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('El correo electrónico o número de documento ya están registrados.');
  });
});