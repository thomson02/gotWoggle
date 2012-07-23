// The main application script, ties everything together.
var express = require('express');
var app = express.createServer();

// Configure the server
app.configure(function(){
        app.use(express.favicon());
        app.use(express.static(__dirname + '/public'));
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(app.router);
    }
);

app.get("/", function(request, response){
    response.sendfile('index.html');
});

//////////////////
// START SERVER //
//////////////////
var port = process.env.PORT || 6000;
app.listen(port, function() {
    console.log("Listening on " + port);
});