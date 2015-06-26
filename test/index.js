var expect = require('chai').expect
var request = require('supertest')

var express = require('express')
var app = express()

var expressNext = require('../')
var appNext = expressNext()

appNext.use('/foo', function* (req, res) {
  res.send(yield Promise.resolve('foo'))
})

appNext.get('/bar', function* (req, res) {
  res.send(yield Promise.resolve('bar'))
})

describe('middleware', function () {
  it('should support generators', function (done) {
    request(appNext).get('/foo')
      .expect(200)
      .expect('foo', done)
  })

  it('next should work correctly', function (done) {
    appNext.get('/next', function (req, res, next) {
      res.locals.text = '1'
      next()
      res.locals.text += '3'
      res.send(res.locals.text)
    }, function (req, res) {
      res.locals.text += '2'
    })

    request(appNext).get('/next')
      .expect(200)
      .expect('123', done)
  })

  it('error handler should work correctly', function (done) {
    appNext.get('/404', function* () {
      throw new Error('Nothing here')
    })

    appNext.use(function* (err, req, res, next) {
      res.status(404).send(err.message + '!')
      next()
    })

    request(appNext).get('/404')
      .expect(404)
      .expect('Nothing here!', done)
  })
})

describe('app.get', function () {
  it('should support generators', function (done) {
    request(appNext).get('/bar')
      .expect(200)
      .expect('bar', done)
  })

  it('should work as original function', function () {
    expect(appNext.get('view')).to.equal(app.get('view'))
  })
})

describe('router', function () {
  it('should support generators', function (done) {
    var router = expressNext.Router()
    appNext.use('/router', router)
    router.get('/foo', function* (req, res) {
      res.send('router/foo')
    })
    request(appNext).get('/router/foo')
      .expect(200)
      .expect('router/foo', done)
  })
})
