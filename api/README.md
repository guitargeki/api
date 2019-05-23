# Overview

The Guitargeki API uses Node.js running the hapi framework.

All POST and PATCH endpoints are secured using JWTs, which can be obtained using the appropriate Auth0 URL.

Endpoint documentation for each API version can be found at `/vX/docs` where `X` is the version number.

## Folder Structure

 - `/lib` - Non version-specific modules.
 - `/versions` - Directory containing separate folders for each API version. Each version should contain a top-level `index.js` file which exports its hapi routes and base Swagger object.

# V1

## Folder Structure

 - `/common` - Common code between any files.
 - `/common/models` - Common code between the `Model` class and `model.js` files.
 - `/common/routes` - Common code between the `Resource` class and `resource.js` files.
 - `/database` - Code related to database functionality such as querying.
 - `/resources` - Each folder here represents a REST resource. Each resource exports its routes and Model instance.
 - `/swagger` - Contains the base Swagger definition (stored in an object).

## Code Structure

### Resource

Each resource creates its own instance of the Resource class. The Resource class contains routes and handlers that are common between multiple resources. For example, most routes perform the GET, POST and PATCH methods in the same manner, so all of that code is put into the Resource class.

If you need to override a resource's route, handler, path etc. create a Resource instance and access the desired variable using regular dot or bracket notation. See `/common/routes/Resource.js` to see where variables are located.

Instead of manually adding each resource's routes, the `/resources/index.js` file will automatically go through each resource folder and import the routes. Since most resources function in the same way, you can skip creating each resource's `routes.js` file. In this case, the `/resources/index.js` file will automatically create a Resource instance and add those routes. Routes added in this way will use the resource's folder name as its base URL path.

### Model

Each resource contains its own `model.js` file, which is imported into the `routes.js` file. The models create a new `Model` instance, which is a collection of common functions such as `create()`, `update()`, `getList()` etc.

Each model defines an input and output schema. The input schema is the schema used to validate the payload for create and update requests. The output schema is currently only used to validate query parameters such as `sort` and `where`.

Finally, each resource exports its Model instance so that other resources can access its schema.