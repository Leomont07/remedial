const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const expressModule = require('../src/index.js');
const app = expressModule.default;

describe('Integración de Endpoints Principales', function() {
    this.timeout(5000); 


    it('GET / debe devolver un estado 200 y mensaje de servidor operativo', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).to.be.equal('Bienvenido al server111');
                expect(res.body).to.be.an('object'); 
                done();
            });
    });

    it('POST /api/service/add debe devolver estado 201 y el objeto creado', (done) => {
        const newService = { 
            nombre: 'Servicio de Prueba', 
            descripcion: 'Test de integracion', 
            precio: 100, 
            tipo: 'hospedaje',
            estatus: 1,
            idUsuario: "886d6971-1b0b-42b1-b9a6-c2e0ee6d74a2"
        };
        request(app)
            .post('/api/service/add')
            .send(newService)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('servicio');
                expect(res.body.servicio).to.have.property('nombre', 'Servicio de Prueba');
                
                done();
            });
    });

    it('POST /api/booking/add debería devolver estado 201 y un objeto', (done) => {
        const validServiceId = "6fbf3af6-6cca-48ea-9d74-8c5f44ad9ce9";
        const validUserId = "317e3e66-f7a5-40b9-95ef-4a59f630b6fa";

        const newBooking = { 
            idUsuario: validUserId, 
            idService: validServiceId, 
            estatus: 'Pendiente', 
            cantidad: 1,
            fechaInicio: "2025-12-10",
            numNoches: 3,
            fechaFin: "2025-12-13"
        };
        request(app)
            .post('/api/booking/add') 
            .send(newBooking)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('booking');
                done();
            });
    });

});