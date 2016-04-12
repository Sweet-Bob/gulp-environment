var yargs = require('yargs')
var noop  = require('through2').obj // noop noop [pingu noises]

var config = require('./config.json')

// returns a boolean representing whether or not {env} and
// {toCheck} represent the same environment
function isEnvironment(env, toCheck) {
  if (typeof toCheck === 'object') {
    return toCheck === env
  }

  return toCheck === env.name || env.aliases.indexOf(toCheck) > -1
}

// returns the environment represented by {param}
// this could be either an environment name, an environment alias,
// or from passing an environment object directly
function getEnvironment(param) {
  var defaultEnvironment

  for (i in environments) {
    var environment = environments[i]

    if (environment.is(param)) {
      return environment
    }

    if (environment.is(config.default)) {
      defaultEnvironment = environment
    }
  }

  return defaultEnvironment
}

// returns {ifTrue} if the current environment is {environment}
// otherwise returns either {ifFalse} or a noop if {ifFalse} is undefined
function pipeIf(environment, ifTrue, ifFalse) {
  if (currentEnvironment === environment) {
    return ifTrue
  } else {
    return ifFalse || noop()
  }
}

// returns a noop if the current environment is {environment}
// otherwise returns {ifFalse}
function pipeIfNot(environment, ifFalse) {
  return pipeIf(environment, noop(), ifFalse)
}

// set up --env=x parameter, without choices/default as it'll get
// checked later at the same time as as NODE_ENV
yargs.option('env', {
  alias: config.yargs.aliases,
  required: false,
  type: 'string'
})

// go through all provided environments and add convenience functions
var environments = config.environments.map(function(env) {
  env.is = function(name) {
    return isEnvironment(env, name)
  }

  return env
})

// get env from parameters or, if it's not there,
// try and read it from the system's environment variables
// if no/an invalid environment has been passed, default to production
var currentEnvironment = getEnvironment(yargs.argv.env || process.env.NODE_ENV)

var envModule = {
  get current() {
    return currentEnvironment
  },

  set current(newEnv) {
    currentEnvironment = getEnvironment(newEnv)
  }
}

envModule.if = pipeIf
envModule.if.not = pipeIfNot

for (i in environments) {
  var environment = environments[i]
  var key = environment.name

  envModule[key] = environment

  envModule.if[key] = function(ifTrue, ifFalse) {
    return pipeIf(environment, ifTrue, ifFalse)
  }

  envModule.if.not[key] = function(ifFalse) {
    return pipeIfNot(environment, ifFalse)
  }
}

module.exports = envModule