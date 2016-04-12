# gulp-environment
Adds easy environment configuration and conditional piping to Gulp, based on NODE_ENV or parameters via yargs.

with :purple_heart:,<br />
&mdash;@helloitsdan

# Usage

This module will load a list of available environments from config.json and try to figure out which one it's currently running in by looking at the `env` parameter first, falling back to the `NODE_ENV` environment varaible if that doesn't exist, and then `config.default` last. These can be specified either by name directly, or by one of a few aliases, also defined in config.json. eg. development mode can be referenced as either `development`, `dev`, or `local`.

To run gulp in production mode using this module, specify your environment either via `gulp --env=production` or `NODE_ENV=production gulp`. Your gulp tasks will then be able to conditionally pipe plugins as follows...

## Example

```javascript
var gulp = require('gulp')
var env = require('gulp-environment')
var cleanCSS = require('gulp-clean-css')

gulp.task('minify-css', function() {
  return gulp.src([
    'assets/scripts/**/*.js'
  ])
    .pipe(env.if.production(
      cleanCSS(), dontRunThisOnLive()
    ))
    .pipe(gulp.dest('web/assets/scripts/'))
})
```

## API

Each of the methods below will be created for each of the environments defined in config.js&mdash;by default, this is development, qa, and production.

### env.current

A getter/setter to access the current environment.

### env.if.environment(ifTrue[, ifFalse])

Returns `ifTrue` if the current environment is `environment`, otherwise returns `ifFalse`. If `ifFalse` is undefined, a no-op is returned instead.

```
  ...
  .pipe(env.if.production(cleanCSS()))
  ...
```

This function can also be accessed manually via `env.if(environment, ifTrue[, ifFalse])`

### env.if.not.environment(ifFalse)

Returns `ifFalse` if the current environment is not `environment`, otherwise returns a no-op.

```
  ...
  .pipe(env.if.not.development(cleanCSS()))
  ...
```

This function can also be accessed manually via `env.if.not(environment, ifFalse)`
