const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const expressModule = require('../src/index.js');
const app = expressModule.default;

describe('Integración de Endpoints Principales', function() {
    this.timeout(5000); 

    // Opcional: Añadir un endpoint de prueba para la raíz (GET /)
    // Ya que no lo tienes, o lo eliminas, o lo añades temporalmente en index.js:
    /* app.get('/', (req, res) => { 
        res.status(200).json({ message: 'Bienvenido a la API' });
    });
    */
    
    // Si asumes que el endpoint raíz existe (lo vamos a eliminar de las pruebas si no lo tienes en index.js):
    // ------------------------------------------------------------------------------------------------

    // PRUEBA 1: Verificar la RUTA DE USUARIOS (Asumiendo que /users es ahora /api/auth)
    // Nota: El endpoint es /api/auth, y dentro de authRoutes el endpoint es / (router.get('/', getAllUsers))
    it('GET /api/auth (todos los usuarios) debe devolver un estado 200', (done) => {
        request(app)
            .get('/api/auth') // <-- RUTA CORREGIDA
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Si getAllUsers devuelve una lista de usuarios (array):
                expect(res.body).to.be.an('array'); 
                done();
            });
    });

    // PRUEBA 2: Verificar la RUTA DE SERVICIOS (POST /add -> /api/service/add)
    it('POST /api/service/add debe devolver estado 201 y el objeto creado', (done) => {
        // Nota: El body que envíes debe coincidir con lo que espera el servicio add
        const newService = { /* datos mínimos requeridos para un servicio */ };
        request(app)
            .post('/api/service/add') // <-- RUTA CORREGIDA
            .send(newService)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                // Si el controlador devuelve el objeto creado, verifica una propiedad:
                // **Asegúrate de que tu controlador devuelve 201 y un objeto.**
                expect(res.body).to.have.property('id');
                done();
            });
    });

    // PRUEBA 3: Verificar la RUTA DE BOOKINGS (POST /add -> /api/booking/add)
    it('POST /api/booking/add debe devolver estado 201 y un objeto', (done) => {
        // Nota: El body que envíes debe coincidir con lo que espera el bookingController.add
        const newBooking = { /* datos mínimos requeridos para una reserva */ };
        request(app)
            .post('/api/booking/add') // <-- RUTA CORREGIDA
            .send(newBooking)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                // Si el controlador devuelve 201 y un objeto con una propiedad clave:
                expect(res.body).to.have.property('message'); // O la propiedad que devuelva el booking
                done();
            });
    });

    // Eliminamos la prueba GET / y POST /products que causaban 404.
});