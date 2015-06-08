# express-next

[![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Travis CI][travis-image]][travis-url] [![Coveralls][coveralls-image]][coveralls-url]

A modern way for using Express.

This package adds the following feature(s) to [Express](http://expressjs.com/):

- [Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)

# Environment Requirement

- `node >= 0.12` with `--harmony`
- `iojs >= 1.0.0`
- `Express >= 4.5` (only this version tested, should work for `4.x`)

# Usage

```
npm install --save express express-next
```

```js
const express = require('express-next')
const app = express()
const router = express.Router()

// Normal function works as usual
app.get('/', function (req, res) {
  res.render('index')
})

app.use('/users', router)

// Generator function works as well
router.get('/:id', function* (req, res) {
  let user = yield User.find(req.params.id)

  if (user) {
    res.locals.user = user
    res.render('user')
  } else {
    // Equals to "next(new Error(`User ${req.params.id} not found!`))"
    throw new Error(`User ${req.params.id} not found!`)
  }
})
```

# Contributors

Via [GitHub](https://github.com/chrisyip/express-next/graphs/contributors)

[npm-url]: https://npmjs.org/package/express-next
[npm-image]: http://img.shields.io/npm/v/express-next.svg?style=flat-square
[daviddm-url]: https://david-dm.org/chrisyip/express-next
[daviddm-image]: http://img.shields.io/david/chrisyip/express-next.svg?style=flat-square
[travis-url]: https://travis-ci.org/chrisyip/express-next
[travis-image]: http://img.shields.io/travis/chrisyip/express-next.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/chrisyip/express-next
[coveralls-image]: http://img.shields.io/coveralls/chrisyip/express-next.svg?style=flat-square
