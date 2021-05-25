const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const assert = require("assert");
const {
    routes
} = require('./routes/routes');

const app = express();
// Load config
const stage = process.env.NODE_ENV || 'production';
const env = dotenv.config({
    path: `${stage}.env`
});
assert.equal(null, env.error);
app.set('env', stage);


app.use(cors());

app.get("/", function (req, res) {
    res.send("node is running")
})

 app.use('/api/', routes)

if (module === require.main) {
    var server = app.listen(process.env.PORT || 8000, function () {
        var port = server.address().port;
        console.log("App listening on port %s", port);
    });
}