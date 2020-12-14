var mongoose = require("../models/db");
var sinon = require('sinon');
var expect = require('chai').expect;
var assert = require('chai').assert;
var should = require('chai').should();
const app = require('../app');
const supertest = require('supertest');
const User = require('../models/user');
var user_controller =
    require('../controllers/user-controller');

// This section of simulate a test when your application IS RUNNING, we are testing by DECLARING ROUTES, and see if it returns the correct data
describe('integration test', function() {
    describe('Sign up', function(){
        context('check if we can sign up', function(){
            it('should add a user successfully', async function(){
                let newUser = {username: 'hahahsdf', password: '123123123'}
                const res  = await supertest(app)
                    .post('/user/sign-up/insert')
                    .query(newUser)
                    .end((err, res)=>{
                        expect(res.statusCode).to.equal(200);
                        expect(res.type).to.equal('application/json');
                        expect(res.body).to.deep.equal(newUser);
                    });

            });
            it('username already in use', async function () {
                let newUser = {username: 'Mary456', password: '123123123'}
                const res  = await supertest(app)
                    .post('/user/sign-up/insert')
                    .query(newUser)
                    .end((err, res)=>{
                        expect(res.statusCode).to.equal(400);
                        expect(res.type).to.equal('application/json');
                        done();
                    });
            });

            it('password too short', async function () {
                let newUser = {username: 'helloworld', password: '123'}
                const res  = await supertest(app)
                    .post('/user/sign-up/insert')
                    .query(newUser)
                    .end((err, res)=>{
                        expect(res.statusCode).to.equal(400);
                        expect(res.type).to.equal('application/json');
                    });
            });
            it('no password input', async function () {
                let newUser = {username: 'Hiworld', password: ''}
                const res  = await supertest(app)
                    .post('/user/sign-up/insert')
                    .query(newUser)
                    .end((err, res)=>{
                        expect(res.statusCode).to.equal(400);
                        expect(res.type).to.equal('application/json');
                    });
            });

            it('no username input', async function () {
                let newUser = {username: '', password: '123123123'}
                const res  = await supertest(app)
                    .post('/user/sign-up/insert')
                    .query(newUser)
                    .end((err, res)=>{
                        expect(res.statusCode).to.equal(400);
                        expect(res.type).to.equal('application/json');
                    });
            });

            it('no password input', async function () {
                let newUser = {username: 'Peter123', password: ''}
                const res  = await supertest(app)
                    .post('/user/sign-up/insert')
                    .query(newUser)
                    .end((err, res)=>{
                        expect(res.statusCode).to.equal(400);
                        expect(res.type).to.equal('application/json');
                    });
            });

        });
    });

    describe('Log in', function(){
        context('check if we can sign up', function(){
            it('should log in successfully', async function(){
                let newUser = {username: 'testing', password: 'test123'}
                const res  = await supertest(app)
                    .post('/user/login')
                    .query(newUser)
                    .end((err, res)=>{
                        expect(res.statusCode).to.equal(200);
                        expect(res.type).to.equal('application/json');
                        expect(res.body).to.deep.equal(newUser);
                    });
            });

            it('wrong username', async function(){
                let newUser = {username: 'testing233', password: 'test123'}
                const res  = await supertest(app)
                    .post('/user/login')
                    .query(newUser)
                    .end((err, res)=>{
                        expect(res.statusCode).to.equal(200);
                        expect(res.type).to.equal('application/json');
                        expect(res.body).to.deep.equal(newUser);
                    });
            });
        });

    });

})