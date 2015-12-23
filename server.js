var express = require('express'),
    fs = require('fs'),
    app = express();
app.get('/sitemap.xml', function(req, res) {
    fs.readFile('./sitemap.xml', 'utf8', function(err, data) {
        if (err) {}
        res.header('Content-Type', 'application/xml');
        res.send(data);
    })
});

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('http://%s:%s/sitemap.xml', 'localhost', port);
});
