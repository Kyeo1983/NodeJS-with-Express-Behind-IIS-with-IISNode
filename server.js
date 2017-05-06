var express	=	require("express");
var bodyParser =	require("body-parser");
var app	= express();
app.use(bodyParser.json());


/******************************************************
Include the packages.
Define the WindowsStrategy by providing 2 parameters: options, verify.

For options here, I simply set it to “integrated: true”. Check out the author’s site for more options.

For verify, it is a function that takes in a profile object and a done callback. You can implement your own verification function here for the validity of the user. Then simply call done with or without errors, err.
******************************************************/
var passport = require('passport');
var WindowsStrategy = require('passport-windowsauth');
passport.use(new WindowsStrategy({
  integrated: true
}, function(profile, done){
	if (profile.id) console.log("logged in: " + profile.id);
	else var err = "No user defined.";
    done(err, profile.id);
}));



/******************************************************
Initialize passport
******************************************************/
app.use(passport.initialize());

/******************************************************
Define a serialization method for the passport's session.
Seems essential.
******************************************************/
passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });
app.use(passport.session());


/******************************************************
Lastly, instantiate the middleware to require Authentication from here on.
******************************************************/
app.use(passport.authenticate('WindowsAuthentication'));


app.get('/', function(req, res){
    res.sendFile(__dirname +  "/index.html");
});
app.use(express.static(__dirname + '/'));


/******************************************************
When running NodeJS behind iisnode (Windows IIS module),
API routes must precede with /node/express
******************************************************/
app.get('/node/express/api/test', function(req, res) {
	res.json(req.user);
});


/******************************************************
Also when running NodeJS behind iisnode, use the port given by IIS process.
******************************************************/
app.listen(process.env.PORT,function(){
    console.log("Working on port " + process.env.PORT);
});
