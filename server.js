// The main application script, ties everything together.
var express = require('express');
var app = express();
var _ = require("underscore");
var nodemailer = require("nodemailer");


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

app.post("/email", function(request, response){
    var message = "Name: " + request.body.name + "\n";
    message += "Email: " + request.body.email + "\n";
    message += "Phone: " + request.body.phone + "\n";
    message += "Message: " + request.body.message;

    var mailOptions = {
        from: "GOTWOGGLE <" + process.env.GMAIL_USERNAME + ">",
        to: request.body.type === "hall" ? process.env.HALL_LETS_ADDRESS : process.env.GMAIL_TO_ADDRESS,
        subject: request.body.subject,
        text: message
    }

    SendEmail(mailOptions, response);
});

function SendEmail(mailOptions, res){
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
        return res.send();
    });
}

//////////////////
// START SERVER //
//////////////////
var port = process.env.PORT || 6000;
app.listen(port, function() {
    console.log("Listening on " + port);
});