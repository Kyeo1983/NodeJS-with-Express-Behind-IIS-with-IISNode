NodeJS with Express Behind IIS using IISNode
==================================
One main purpose of hosting NodeJS behind IIS is to leverage Window's Authentication for Single Sign-On in an Enterprise setting. This project is a base that demonstrates how to put in place such a setting.

The key utilities to be used here are [IISNode](https://github.com/tjanczuk/iisnode/blob/master/README.md) and npm's <a href="https://www.npmjs.com/package/passport-windowsauth" target="_blank">passport-windowsauth</a>. Refer to the author’s write up in the links above.

1. Install the correct version of IISNode on your server.

2. Create a new website and point it to your NodeJS directory.
  Let's set it to 3000 for this example. Of course, you can use any other port number you like.  
  Then start it up.  
   <img height="101px" width="448px" src="https://github.com/Kyeo1983/NodeJS-with-Express-Behind-IIS-with-IISNode/blob/master/readmeImg/Snap16.png"/>  
   <img height="433px" width="529px" src="https://github.com/Kyeo1983/NodeJS-with-Express-Behind-IIS-with-IISNode/blob/master/readmeImg/Snap10.png"/>

3. Create a web.config on the directory with these settings.  
   <img height="195px" width="194px" src="https://github.com/Kyeo1983/NodeJS-with-Express-Behind-IIS-with-IISNode/blob/master/readmeImg/Snap11.png"/>

   * __handlers__ will indicate to IIS that this is a NodeJS application, and which .js file is the runtime.
    Therefore when opening this .js file from browser will not trigger a download and will instead run NodeJs.
   * __iisnode__ contains configurations specific to your instance. Refer to the author’s site for more information.
    But 1 thing to note that I encountered, somehow the application fails to run if nodeProcessCommandLine option is used.
   * __defaultDocument__ is set to NodeJS server .js file so that it is still launched at root path.
   * __rewrite__ will enforce all paths at this website to be ran through NodeJS instance.


4. Navigate to __http://server:3000/node/express__. The index.html loads up.  
   <img height="127px" width="396px" src="https://github.com/Kyeo1983/NodeJS-with-Express-Behind-IIS-with-IISNode/blob/master/readmeImg/Snap12.png"/>

   All the URLs has to be prefixed with /node/express now.  
   **This is an after‐effect of using ExpressJS along with IISNode.**



5. Click on the button, it fires an AJAX GET to /node/express/api/test.  
   It returns the logged on username, in this case “yeowh”.  
   <img height="117px" width="354px" src="https://github.com/Kyeo1983/NodeJS-with-Express-Behind-IIS-with-IISNode/blob/master/readmeImg/Snap25.png"/>


6. Static files are still accessible from root path like /img/test.jpg.  
   <img height="296px" width="341px" src="https://github.com/Kyeo1983/NodeJS-with-Express-Behind-IIS-with-IISNode/blob/master/readmeImg/Snap17.png"/>


7. What is required to be done on NodeJS to support these?  
   * route for the root site is still defined as usual, so static files can still be accessed from the root path.  
      ```javascript
      app.get('/', function(req, res) {
      	res.sendFile(__dirname +  "/index.html");
      });
      app.use(express.static(__dirname + '/'));
      ```
   
   * routes for api calls has to precede with /node/express.  
   In this example, my API returns the logged on username retrieved from IIS. More descriptions below on how the username is obtained.
      ```javascript
      app.get('/node/express/api/test', function(req, res) {
      	res.json(req.user);
      });
      ```
   
   * set listening port to process.env.PORT, which is actually the port that IIS is binding this website to.
      ```javascript
      app.listen(process.env.PORT,function(){
      	console.log("Working on port " + process.env.PORT);
      });
      ```
   

8. Prior to the routes definitions, we need to define the passport strategy to use. In this case, it is Windows Authentication.
   * Include the packages  
      ```javascript
      var passport = require('passport');
      var WindowsStrategy = require('passport‐windowsauth');
      ```
   * Then define the WindowsStrategy by providing 2 parameters: __options__, __verify__.  
   For __options__ here, I simply set it to __“integrated: true”__. Check out the author’s site for more options.  
   For __verify__, it is a function that takes in a profile object and a done callback. You can implement your own verification
function here for the validity of the user. Then simply call done with or without errors, err.
      ```javascript
      passport.use(new WindowsStrategy({ integrated: true }, function(profile, done){
	      if (profile.id) console.log("logged in: " + profile.id);
	      else var err = "No user defined.";
        done(err, profile.id);
      }));
      ```

   * Lastly, initialize the passport.  
      ```javascript
      app.use(passport.initialize());
      ```
      

9. Then define a serialization method for the passport’s session.  
   ```javascript
   passport.serializeUser(function(user, done) { done(null, user); });
   passport.deserializeUser(function(user, done) { done(null, user); });
   app.use(passport.session());
   ```


10. Lastly, we instantiate the middleware to require Authentication from here on.  
   ```javascript
   app.use(passport.authenticate('WindowsAuthentication'));
   ```


11. Notice that we do not need to launch **cmd>>node server.js**.  
In this case, IIS is managing that for us. Read IISNode’s original documentation to understand what other effects
arise from this setup.

12. Next we test Securing by Authentication and Authorization.
   * Go to IIS, the usual Authentication section
      <img height="143px" width="383px" src="https://github.com/Kyeo1983/NodeJS-with-Express-Behind-IIS-with-IISNode/blob/master/readmeImg/Snap18.png"/>
   
   * Set Windows Authentication to Enabled, and Disable Anonymous Authentication  
      <img height="200px" width="467px" src="https://github.com/Kyeo1983/NodeJS-with-Express-Behind-IIS-with-IISNode/blob/master/readmeImg/Snap19.png"/>

   * Go to Authorization (what’s new…)  
      <img height="129px" width="325px" src="https://github.com/Kyeo1983/NodeJS-with-Express-Behind-IIS-with-IISNode/blob/master/readmeImg/Snap20.png"/>
      
   * Set Authorization to somebody else to test  
      <img height="126px" width="320px" src="https://github.com/Kyeo1983/NodeJS-with-Express-Behind-IIS-with-IISNode/blob/master/readmeImg/Snap21.png"/>
