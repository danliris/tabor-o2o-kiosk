var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.use(function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var port = process.env.PORT || 10066;

var server = app.listen(port, function () {
    console.log('Listening on port %d', server.address().port);
});