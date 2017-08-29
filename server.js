const http = require('http');


const port = process.env.PORT || 3000;

const server = http.createServer(function(req, res) {
    res.writeHead(302, {Location: 'https://docs.telemetry.mozilla.org/'});
    res.end();
});

server.listen(port, function() {
    console.log('Listening on port ' + port + '...');
});
