let chai = require('chai');
let mocha = require('mocha');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let should = chai.should();
require('dotenv').config()
const dBUsers = require('../modules/dbUser');
const auth = require("../modules/authentication/authentication")
chai.use(chaiHttp);
const url= 'http://localhost:3000';


mocha.describe('Prueba a realizar un Login correcto y uno incorrecto: ',function () {
    this.timeout(5000);

	it('Correct Login', (done) => {
		chai.request(url)
			.post('/login')
			.send({userName:"user_asturias", password: "user_asturias"})
			.end( function(err,res){
				expect(res).to.have.status(200);
				done();
			});
    });

	it('Wrong Login', (done) => {
		chai.request(url)
			.post('/login')
			.send({userName:"userX", password: "user",})
			.end( function(err,res){
				expect(res).to.have.status(403);
				done();
			});
    });
    
});

mocha.describe('Prueba a buscar todos los datos',function(){
    it('Get all data: ', (done) =>{
        var token = auth.createToken(dBUsers.login("user_asturias","user_asturias").userName);
        chai.request(url)
        .get('/data')
        .set('Authorization',token)
        .end(function(err,res){
            expect(res).to.have.status(200);
            res.body.should.be.a('array');
            done();
        }) 
    });
});

mocha.describe('Prueba a buscar un dato por id',function(){

    it('Get by id: ', (done) =>{
        var token = auth.createToken(dBUsers.login("user_asturias","user_asturias").userName);
        chai.request(url)
        .get('/data/ID_AS')
        .set('Authorization',token)
        .end(function(err,res){
            expect(res).to.have.status(200);
            res.body.should.be.a('array');
            done();
        })
    });

});