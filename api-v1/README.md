# Overview

The Guitargeki V1 API uses Node.js running the hapi framework.

All POST and PATCH are secured using JWTs, which can be obtained using the appropriate Auth0 URL.

Auto-generated Swagger documentation can be found at `/v1/docs`.

## Folder Structure

 - `/common` - Modules and code that is common between multiple files.
 - `/common/models` - Common code between the `Model` class and `model.js` files.
 - `/common/routes` - Common code between the `Resource` class and `resource.js` files.
 - `/database` - Code related to database functionality such as querying.
 - `/resources` - Each folder here represents a REST resource. Each resource exports its routes and Model instance.
 - `/server` - Code to start the hapi server.
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