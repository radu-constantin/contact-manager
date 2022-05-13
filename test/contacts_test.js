process.env.NODE_ENV = 'test';
process.env.PORT = '4567';

let chai = require('chai');
var expect = require('chai').expect
let chaiHttp = require('chai-http');
let server = require('../contacts');
let contactManager = require('../lib/contact_manager');

chai.use(chaiHttp);
//Our parent block
describe('Contacts', () => {
    afterEach((done) => { //Before each test we empty the database
      contactManager.removeAll();
      done();
    });
/*
  * Test the /GET route
  */
  describe('GET api/contacts', () => {
    it('it should respond with JSON of empty array when there are no contacts', (done) => {
      chai.request(server)
        .get('/api/contacts')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.eql([]);
          done();
        });
    });

    it('it should respond with JSON of all contacts if any', (done) => {
      contactManager.add({full_name: "Naveed Fida"});
      chai.request(server)
        .get('/api/contacts')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.eql(1);
          expect(res.body).to.eql(contactManager.getAll());
          done();
        });
    });
  });

  describe('GET api/contacts/{id}', () => {
    it('it should responds with the requested contact if {id} is correct', (done) => {
      let pete = contactManager.add({full_name: 'Pete Hanson'});
      chai.request(server)
        .get('/api/contacts/' + pete.id)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.eql(pete);
          done();
        });
    });

    it('it should respond with 404 if contact with {id} not found', (done) => {
      contactManager.add({full_name: "Naveed Fida"});
      let pete = contactManager.add({full_name: 'Pete Hanson'});
      chai.request(server)
        .get('/api/contacts/' + pete.id + 1)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe('POST api/contacts', () => {
    it('it should create the contact if full_name is present', (done) => {
      chai.request(server)
        .post('/api/contacts/')
        .send({full_name: 'Naveed Fida'})
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(contactManager.getAll().length).to.eq(1)
          expect(res.body).to.eql(contactManager.getAll()[0]);
          done();
        });
    });

    it('it should respond with 404 if full_name is not present', (done) => {
      chai.request(server)
        .post('/api/contacts/')
        .send({phone_number: 49850394580})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(contactManager.getAll().length).to.eq(0);
          done();
        });
    });
  });

  describe('PUT api/contacts/{id}', () => {
    it('it should update the contact', (done) => {
      let naveed = contactManager.add({full_name: 'Naveed Fida', email: 'nf@ab.com'})
      chai.request(server)
        .put(`/api/contacts/${naveed.id}`)
        .send({full_name: 'Victor Reyes', email: 'vpr@ab.com'})
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(contactManager.get(naveed.id).full_name).to.eq('Victor Reyes');
          expect(contactManager.get(naveed.id).email).to.eq('vpr@ab.com');
          expect(res.body).to.eql(contactManager.get(naveed.id));
          done();
        });
    });

    it('it should preserve the previous values of the contact if no new values given', (done) => {
      let naveed = contactManager.add({full_name: 'Naveed Fida', email: 'nf@ab.com'})
      chai.request(server)
        .put(`/api/contacts/${naveed.id}`)
        .send({full_name: 'Victor Reyes'})
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(contactManager.get(naveed.id).full_name).to.eq('Victor Reyes');
          expect(contactManager.get(naveed.id).email).to.eq('nf@ab.com');
          expect(res.body).to.eql(contactManager.get(naveed.id));
          done();
        });
    });
  });

  describe('DELETE api/contacts/{id}', () => {
    it('it should delete the contact with {id}', (done) => {
      let naveed = contactManager.add({full_name: 'Naveed Fida', email: 'nf@ab.com'})
      chai.request(server)
        .delete(`/api/contacts/${naveed.id}`)
        .end((err, res) => {
          expect(res).to.have.status(204);
          expect(contactManager.getAll().length).to.eql(0);
          done();
        });
    });

    it('it should respnd with 400 if {id} is not valid', (done) => {
      let naveed = contactManager.add({full_name: 'Naveed Fida', email: 'nf@ab.com'})
      chai.request(server)
        .delete(`/api/contacts/${naveed.id + 1}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(contactManager.getAll().length).to.eql(1);
          done();
        });
    });
  });
});
