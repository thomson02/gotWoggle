// The main application script, ties everything together.
var express = require('express');
var MongoStore = require('connect-mongo')(express);
var mongoose = require('mongoose');
var app = express.createServer();

// Setup DB Access
mongoose.connect(process.env.MONGOLAB_URI);

// Declare Mongoose Schemas
var Event = mongoose.model('Event', new mongoose.Schema({
    title: String,
    startDate: Number,
    endDate: Number,
    section: String,
    imageUrl: String,
    htmlBody: String,
    downloads: [mongoose.Schema.Types.Mixed],
    links: [mongoose.Schema.Types.Mixed]
}));

// Configure the server
app.configure(function(){
        app.use(express.favicon());
        app.use(express.static(__dirname + '/public'));
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.session({
            secret: process.env.SESSION_AUTH,
            store: new MongoStore({
                url : process.env.MONGOLAB_URI
            })
        }));
        app.use(app.router);
    }
);

// Setup DB Access
mongoose.connect(process.env.MONGOLAB_URI);

///////////////////////////////////////////////////////////
// UNPROTECTED ROUTES                                    //
// (All files in public folder are not protected either) //
///////////////////////////////////////////////////////////
app.get("/", function(request, response){
    response.sendfile('index.html');
});

///////////////////////////////////////////////////////////
// UNPROTECTED API                                       //
///////////////////////////////////////////////////////////
var dummyEvents = [
    { title: "Dummy1", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "beavers" },
    { title: "Dummy2", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "scouts" },
    { title: "Dummy3", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "scouts" },
    { title: "Dummy4", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "scouts" },
    { title: "Dummy5", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "scouts" },
    { title: "Dummy6", startDate: "20120912", endDate: "20120912", imageUrl: "", htmlBody: "<h1>Hello World</h1>", downloads: [], links: [], section: "scouts" }];

app.get("/api/events/:section/:page", function(req, res) {
    var pageSize = 15;
    var criteria = {
        section: req.params.section,
        skip: (req.params.page * pageSize),
        limit: pageSize
    };

    Event.find(criteria, function(err, events){
        if (!err){
            var pageIndex = Math.round(events.length / pageSize);

            return res.send({
                pageSize: pageSize,
                lastPage: ((events.length % pageSize) == 0) ? --pageIndex : pageIndex,
                results: events
            });
        }
    });
});

//////////////////////
// ROUTE PROTECTION //
//////////////////////
/*app.all("*", function(request, response, next){
    if (request.session.loggedInUser){
        next();
    }
    else {
        console.log("Not Authorised");
        response.redirect("/login.html");
    }
});
*/

///////////////////////////////////////////////////////////
// PROTECTED API                                         //
///////////////////////////////////////////////////////////
app.post('/api/event', function(req, res) {
    var event = new Event({
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        section: req.body.section,
        imageUrl: req.body.imageUrl,
        htmlBody: req.body.htmlBody,
        downloads: req.body.downloads,
        links: req.body.links
    });

    event.save(function(err){
        if (!err) {
            return console.log("created");
        }
    });

    return res.send(event);
});


//////////////////
// START SERVER //
//////////////////
var port = process.env.PORT || 6000;
app.listen(port, function() {
    console.log("Listening on " + port);
});