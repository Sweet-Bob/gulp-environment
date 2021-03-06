var util   = require('gulp-util')
var should = require('chai').should()
var env    = require('./index.js')
var config = require('./config.json')

var fauxPipe = {
  obj1: { name: "object one!" },
  obj2: { name: "object two!" }
}

describe("Environment", function() {
  it("should default to production", function() {
    should.exist(env.current)
    should.exist(env.current.name)
    env.current.name.should.equal('production')
  })

  it("should set up environments defined in config.json", function() {
    config.environments.forEach(function(environment) {
      should.exist(env[environment.name])
    });
  })

  it("should add environment helper methods", function() {
    should.exist(env.current.is)
    env.current.is.should.be.a('function')

    should.exist(env.is[env.current.name])
    should.exist(env.if[env.current.name])
    should.exist(env.if.not[env.current.name])
  })

  it("should support switching between environments", function() {
    env.current = 'development'
    env.current.name.should.equal('development')

    env.current = env.qa
    env.current.name.should.equal('qa')
  })

  it("should support using environment aliases", function() {
    env.current = 'live'
    env.current.name.should.equal('production')
  })

  describe("is()", function() {
    it("should compare environments", function() {
      env.current = 'production'

      env.current.is('production').should.be.ok
      env.current.is('development').should.not.be.ok

      env.is.production().should.be.ok
      env.is.development().should.not.be.ok
    })

    it("should support environment aliases", function() {
      env.current = 'production'

      env.current.is('prod').should.be.ok
    })
  })

  describe("if() piping", function() {
    it("should pipe based on the current environment", function() {
      env.current = 'production'

      env.if('production', fauxPipe.obj1, fauxPipe.obj2).should.equal(fauxPipe.obj1)
      env.if('development', fauxPipe.obj1, fauxPipe.obj2).should.equal(fauxPipe.obj2)
    })

    it("should return a noop on failure without a specific failure pipe", function() {
      env.current = 'production'

      env.if('qa', fauxPipe).constructor.name.should.equal('DestroyableTransform')
    })

    it("should support chaining syntax as well as multiple parameters", function() {
      env.current = 'production'

      env.if.production(fauxPipe.obj1).else(fauxPipe.obj2).should.equal(fauxPipe.obj1)
      env.if.development(fauxPipe.obj1).else(fauxPipe.obj2).should.equal(fauxPipe.obj2)
    })
  })

  describe("if.not() piping", function() {
    it("should pipe based on the current environment", function() {
      env.current = 'production'

      env.if.not('production', fauxPipe.obj2).should.not.equal(fauxPipe.obj2)
      env.if.not('development', fauxPipe.obj2).should.equal(fauxPipe.obj2)

      env.if.not.production(fauxPipe.obj2).should.not.equal(fauxPipe.obj2)
      env.if.not.development(fauxPipe.obj2).should.equal(fauxPipe.obj2)
    })
  })
});
