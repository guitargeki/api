const express = require("express");
const app = express();

const apiV1 = require("./api/v1/v1.js");
app.use("/v1", apiV1.router);

// Handle any invalid routes
app.get("*", function (request, response) {
    response.send("It seems like there's nothing here...");
});

app.listen(3000);