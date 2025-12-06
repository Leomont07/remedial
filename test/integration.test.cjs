const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
import app from '../src/index.js';

describe('Integración de Endpoints Principales', function() {
  // Aumenta el tiempo de espera para pruebas de integración si es necesario
  this.timeout(5000); 

  const expressApp = (app && app.default) ? app.default : app;

  // Prueba 1: Verificar el endpoint raíz (/)
  it('GET / debe devolver un estado 200 y mensaje de bienvenida', (done) => {
    request(expressApp)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Ajusta el texto esperado a lo que devuelva tu API
        expect(res.body.message).to.be.equal('Bienvenido a la API');
        done();
      });
  });

  // Prueba 2: Verificar un endpoint de ejemplo de microservicio (ej. /users)
  it('GET /users debe devolver una lista (array) y estado 200', (done) => {
    request(expressApp)
      .get('/users')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Prueba 3: Verificar un endpoint que requiere POST (ej. /products)
  it('POST /products debe devolver estado 201 y el objeto creado', (done) => {
    const newProduct = { name: 'Test Product', price: 9.99 };
    request(expressApp)
      .post('/products')
      .send(newProduct)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.name).to.be.equal(newProduct.name);
        done();
      });
  });
});