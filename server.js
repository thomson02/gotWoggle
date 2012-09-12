// The main application script, ties everything together.
var express = require('express');
var mongoose = require('mongoose');
var app = express.createServer();

// Setup DB Access
//mongoose.connect(process.env.MONGOLAB_URI);

// Declare Mongoose Schemas
var Event = mongoose.model('Event', new mongoose.Schema({

}));

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



var dummyEvents = [
    { title: "Dummy1", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "beavers" },
    { title: "Dummy2", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "scouts" },
    { title: "Dummy3", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "scouts" },
    { title: "Dummy4", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "scouts" },
    { title: "Dummy5", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "scouts" },
    { title: "Dummy6", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "scouts" }];

app.get("/api/events/:section/:page", function(req, res) {

    var pageSize = 5;
    var pageIndex = Math.round(dummyEvents.length / pageSize);

    return res.send({
        pageSize: pageSize,
        lastPage: ((dummyEvents.length % pageSize) == 0) ? --pageIndex : pageIndex,
        results: dummyEvents.slice(req.params.page * pageSize, (req.params.page * pageSize) + pageSize)
    });
});

//////////////////
// START SERVER //
//////////////////
var port = process.env.PORT || 6000;
app.listen(port, function() {
    console.log("Listening on " + port);
});