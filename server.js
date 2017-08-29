const express = require('express');


const app = express();
const port = process.env.PORT || 3000;

app.all('*', function(req, res) {
    res.redirect(302, 'https://docs.telemetry.mozilla.org/');
});

app.listen(port, function() {
    console.log('Listening on port ' + port + '...');
});
