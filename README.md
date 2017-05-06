NodeJS with Express Behind IIS using IISNode
==================================
One main purpose of hosting NodeJS behind IIS is to leverage Window's Authentication for Single Sign-On in an Enterprise setting. This project is a base that demonstrates how to put in place such a setting.

The key utilities to be used here are [IISNode](https://github.com/tjanczuk/iisnode/blob/master/README.md) and npm's <a href="https://www.npmjs.com/package/passport-windowsauth" target="_blank">passport-windowsauth</a>. Refer to the author’s write up in the links above.

1. Install the correct version of IISNode on your server.

2. Create a new website and point it to your NodeJS directory.
Let's set it to 3000 for this example. Of course, you can use any other port number you like.
Then start it up.
