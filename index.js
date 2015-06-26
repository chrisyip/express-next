var co = require('co')
var express = require('express')

function isGenerator (input) {
  return input && input.constructor.name === 'GeneratorFunction'
}

function middlewareWrapper (middleware) {
  if (middleware.length === 4) {
    return function (err, req, res, next) {
      co.wrap(middleware).call(this, err, req, res, next).catch(next)
    }
  }

  return function (req, res, next) {
    co.wrap(middleware).call(this, req, res, next).catch(next)
  }
}

function methodWrapper (method) {
  return function () {
    var argv = [].slice.call(arguments)

    argv = argv.map(function (arg) {
      if (isGenerator(arg)) {
        return middlewareWrapper(arg)
      }
      return arg
    })

    return method.apply(this, argv)
  }
}

function methodsWrapper (target) {
  ['use', 'get', 'post', 'put', 'delete', 'all'].forEach(function (method) {
    target[method] = methodWrapper(target[method])
  })
  return target
}

methodsWrapper(express.application)

var Router = express.Router

express.Router = function () {
  return methodsWrapper(Router.apply(express, arguments))
}

express.Router.prototype = Router.prototype

Object.keys(Router).forEach(function (key) {
  express.Router[key] = Router[key]
})

module.exports = express
