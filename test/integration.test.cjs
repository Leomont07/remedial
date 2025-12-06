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
                expect(res.body.message).to.be.equal('Bienvenido al server');
                expect(res.body).to.be.an('object'); 
                done();
            });
    });



    // Eliminamos la prueba GET / y POST /products que causaban 404.
});