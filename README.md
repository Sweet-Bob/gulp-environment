# gulp-environment
Adds easy environment configuration and conditional piping to Gulp, based on NODE_ENV or parameters via yargs.

with :purple_heart:,
—@helloitsdan

# Usage

## Example

```javascript
var gulp = require('gulp')
var env = require('gulp-environment')
var cleanCSS = require('gulp-clean-css')

gulp.task('minify-css', function() {
  return gulp.src([
    'assets/scripts/**/*.js'
  ])
    .pipe(env.if.not.production(cleanCSS()))
    .pipe(gulp.dest('web/assets/scripts/'))
})
```

## API

Each of the methods below will be created for each of the environments defined in `config.js`&mdash;by default, this is development, qa, and production.

### env.current

A getter/setter to access the current environment. `env.current` will return an object representing the current environment which can be passed to all other functions in this module.

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
