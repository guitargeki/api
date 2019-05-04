# API Versions

Each API version should be as self-contained as possible. This ensures that a break in one version will not break functionality in another version. This also means each version should implement its own logger and error handler since request, response and error information will vary between versions.

The top-level `index.js` file is responsible for anything that should occur regardless of API version. This includes:

 - Adding a UUID for every request so they can be identified easily
 - Setting headers for convenience and security (such as removing the `server` header)
 - Handling any invalid routes
 - Starting the server

`index.js` should be the only file at the root of the `src` folder.

# OpenAPI (Swagger)

The OpenAPI specification is defined inside of `.js` files instead of `.json` or `.yaml` files. While this is less readable than `.yaml` files, it is much more flexible as it allows for functions, arithmetic, string concatenation etc.

Ths specification used is slightly different from pure OpenAPI 2.0.

# Style Guide

Functions should be annotated with JSDoc.

Use `error, request, response` instead of `err, req, res`.

Use arrow functions for callbacks. Otherwise, use `function functionName()`.

Use `module.exports` instead of `exports`

# Queries

## Sorting

## Filtering

## Pagination

# Error Handling

If you call `next()` without any arguments, the next middleware (that isn't an error handler) will be queued. However, if you provide an argument, Express assumes there was an error and will queue the next error handler instead.

Example:

```js
// Middleware
app.use((request, response, next) => {
    console.log("HELLO");
    
    // This will queue the next middleware
    next();

    // This will queue the next error handler
    next("TEST");
});

// This middlware will be skipped if next() contains an argument
app.use((request, response, next) => {
    console.log("WORLD");
});

// This error handler will only execute if next() contains an arugment
app.use((error, request, response, next) => {
    // This will print whatever was passed into next().
    // In this case, it will print the word TEST.
    console.log(error);
});
```

Notice that in the example, both the middleware and error handler will be queued. To prevent this, make sure to only use `next()` once or do `return next()`.