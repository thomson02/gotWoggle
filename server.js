// The main application script, ties everything together.
var express = require('express');
var MongoStore = require('connect-mongo')(express);
var mongoose = require('mongoose');
var app = express.createServer();
var _ = require("underscore");
var nodemailer = require("nodemailer");

// Declare Mongoose Schemas
var Event = mongoose.model('Event', new mongoose.Schema({
    title: String,
    startDate: Number,
    endDate: Number,
    section: String,
    imageUrl: String,
    htmlBody: String,
    downloads: [mongoose.Schema.Types.Mixed],
    links: [mongoose.Schema.Types.Mixed],
    priority: String,
    description: String
}));

var Media = mongoose.model('Media', new mongoose.Schema({
    title: String,
    description: String,
    section: String,
    bucket: String,
    date: Number,
    media: [String]
}));

// Amazon S3
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var S3 = awssum.load('amazon/s3').S3;
var s3 = new S3({
    'accessKeyId' : process.env.AMAZON_ACCESS_KEY_ID,
    'secretAccessKey' : process.env.AMAZON_SECRET_ACCESS_KEY,
    'region' : amazon.EU_WEST_1
});

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
app.get("/api/schedule/:section/:startDate/:endDate", function(req, res){
    Event.find(
        { section: req.params.section, startDate: {$gt: parseInt(req.params.startDate), $lte: parseInt(req.params.endDate) } },
        function(err, events){
            if (!err){
                return res.send(events);
            }
        }
    );
});

app.get("/api/events/:section/:page", function(req, res) {
    var pageSize = 5;
    var todaysDate = new Date();
    var todayString = (todaysDate.getFullYear() + ('0' + (todaysDate.getMonth()+1)).slice(-2) + ('0' + todaysDate.getDate()).slice(-2));

    Event.find(
        { section: req.params.section, startDate: { $gt: parseInt(todayString) } },
        null,
        { sort: {"startDate": 1 } },
        function(err, events){
            if (!err){

                var eventsWithData = _.filter(events, function(e) { return e.htmlBody && e.htmlBody.length > 0; });
                var portion = eventsWithData.slice(req.params.page * pageSize, (req.params.page * pageSize) + pageSize);
                var pageIndex = Math.ceil(eventsWithData.length / pageSize);

                return res.send({
                    pageSize: pageSize,
                    lastPage: pageIndex === 0 ? pageIndex : --pageIndex,
                    results: portion
                });
            }
        }
    );
});

app.get('/api/media/:section/:page', function(req, res) {
    var pageSize = 6;

    Media.find(
        { section: req.params.section },
        null,
        { sort: {"date": -1 } },
        function(err, mediaList){

            if (!err){
                var mediaListPortion = mediaList.slice(req.params.page * pageSize, (req.params.page * pageSize) + pageSize);
                var resolved = mediaListPortion.length < pageSize ? mediaListPortion.length : pageSize;
                if (mediaListPortion.length === 0){
                    return res.send({ pageSize: 0, lastPage: 0, results: []});
                }

                _.each(mediaListPortion, function(media){
                    if (media.bucket === "youtube") {
                       resolved--;
                    }
                    else {
                        s3.ListObjects({ BucketName: media.bucket, MaxKeys: 50 }, function(err, data){
                            // update media listing
                            if (_.isArray(data.Body.ListBucketResult.Contents)){
                                media.media = _.map(data.Body.ListBucketResult.Contents, function(c){ return c.Key; });
                            }
                            else {
                                media.media = [data.Body.ListBucketResult.Contents.Key];
                            }

                            // return api call with data
                            if (--resolved === 0){
                                var pageIndex = Math.ceil(mediaList.length / pageSize);
                                return res.send({
                                    pageSize: pageSize,
                                    lastPage: pageIndex === 0 ? pageIndex : --pageIndex,
                                    results: mediaListPortion
                                });
                            }
                        });
                    }
                });
            }
            else {
                return res.send({ pageSize: 0, lastPage: 0, results: []});
            }
        }
    );
});

app.post("/email", function(request, response){
    var message = "Name: " + request.body.name + "\n";
    message += "Email: " + request.body.email + "\n";
    message += "Phone: " + request.body.phone + "\n";
    message += "Message: " + request.body.message;

    var mailOptions = {
        from: "GOTWOGGLE <" + process.env.GMAIL_USERNAME + ">",
        to: process.env.GMAIL_TO_ADDRESS,
        subject: request.body.subject,
        text: message
    }

    SendEmail(mailOptions);
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
/* DISABLED!!!!!!!!!!
app.post('/api/event', function(req, res) {
    var event = new Event({
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        section: req.body.section,
        imageUrl: req.body.imageUrl,
        htmlBody: req.body.htmlBody,
        downloads: req.body.downloads,
        links: req.body.links,
        priority: req.body.priority
    });

    event.save(function(err){
        if (!err) {
            return console.log("created");
        }
    });

    return res.send(event);
});

app.post('/api/media', function(req, res) {
   var media = new Media({
       title: req.body.title,
       description: req.body.description,
       section: req.body.section,
       bucket: req.body.bucket,
       date: req.body.date,
       media: []
   });

   media.save(function(err){
        if (!err) {
            return console.log("created");
        }
    });

    return res.send(media);
});
*/

function SendEmail(mailOptions){
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}

//////////////////
// START SERVER //
//////////////////
var port = process.env.PORT || 6000;
app.listen(port, function() {
    console.log("Listening on " + port);
});