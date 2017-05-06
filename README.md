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
