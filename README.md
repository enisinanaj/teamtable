# Angle Material

## Bootstrap Admin App + AngularJS Material

AngularJS Material version is based on the AngularJS
 
This document describes the basic about this version and particular changes made to style and feature the product using the Google Material Design approach.
 
Said that, you will find relevant information by reading the AngularJS documentation to understand the most important parts of the product related to AngularJS features.
 
All the best and enjoy coding.
Getting started
Tips

Do not start from scratch, use an existing asset and modify it to learn how it works.
Explore the sources for ideas and sample code.
Use Firebug or Chrome Developer Tools to find bugs on your website. Using one of those tools will help you to save time analyzing the site and finding elements structure, like classes, id or tags
Quick tip: open your site with Chrome, press F12 and go to console tab, reload your page and if something goes wrong you will see your page errors in red text.
In case of error messages, someone might have seen it too, so you can try a Google search for a quick fix.
 
## Starting the app

Since this is AngularJS based application you need a server (Apache, IIS, xampp, etc) to serve the html files and perform http request to load all views.
 
Important! Opening the index.html with a double click (i.e. using file:// protocol) will show you only a blank page because there’s no server that response to the requests made for each view in order to display the app interface.
Integrated server (BrowserSync)

 
See section Build to install node and bower dependecies and then run gulp task to automatically serve the app
 
## Alternative server setup (requires nodejs)

This is simple solution for a basic server setup using nodejs that might help you. If don't have installed nodejs take a look at the Build section to learn about it
 
*Install the http-server  (-g installs globally)*
  `npm install http-server -g`
  
*Once it is installed move to the root folder of the theme (where index.html is located) and run*
  `http-server . -a 127.0.0.1 -p 8080`
 
If everything goes fine you can now access to the app at http://127.0.0.1:8080/
 
## Structure

The structure of the project is the same described for AngularJS project in the proper documentation. Here we list the relevant changes for you to find the changed parts related to Material Design features.
 
__HTML/JADE__
 
All views displaying custom material components are named like follows
 
material.cards.jade
material.colors.jade
material.forms.jade
material.inputs.jade
material.lists.jade
material.ngmaterial.jade
material.whiteframe.jade
material.widgets.jade


__LESS/SCSS__

Component styles for Material design are listed under folder less/material or scss/material

material/cards.less/.scss
material/colors.less/.scss
material/md-forms.less/.scss
material/md-inputs.less/.scss
material/md-list.less/.scss
material/ngmaterial.less/.scss
material/welcome.less/.scss
 
__JavaScript__
 
Since this version is based on the new modular organization of the product, all relate Material stuff is located in the new module 'app.material'
Using the following files
 
js/modules/material.config.js
js/modules/material.controller.js
js/modules/material.module.js
js/modules/material.run.js
js/modules/material.widgets.controller.js
 
 
 
## Build

Important! You only need to follow this instructions in case you want to work with JADE, LESS and concatenate all JS modules.
 
Node.js is a platform built on Chrome’s JavaScript runtime for easily building fast, scalable network applications.
 
Gulp is a task manager, you can define different tasks to run certain commands. Those commands does the compilation job for JADE and LESS, and concatenates the JS files.
 
Bower is a dependency manager, it works by fetching and installing packages from all over, taking care of hunting, finding, downloading, and saving the stuff you’re looking for. Bower keeps track of these packages in a manifest file, bower.json.
 
The package includes under the master/ folder the file gulpfile.js, package.json and bower.json to install the required components to compile the source files.
 
### Installing tools
 
The following steps are intended to be an orientation guide, if you are not experienced with this you will need to learn more about it from Google :)
 
To install node and npm, go to http://nodejs.org/
Run npm install -g bower to install bower to manage dependencies
Download and install GIT for your platform http://git-scm.com/downloads
 
### Once you have all tools installed
 
Open a terminal, go the package master/ folder, then run the command npm install. This command will install gulp and all project dependencies.
Then, to install vendor dependencies, run bower install
Finally run gulp to start the task manager
If everything goes fine, you should see the messages in the terminal telling you that most the task are done ok. The task will watch for files to compile them automatically all files when change.
 
 
You can also run npm start inside master folder to automatically install npm packages, bower dependencies and finally gulp, all with just one command.
 
Main Gulp tasks

 
 
This command will run the default task without minify assets
`$ gulp`
This task will generate the assest wihout mininfy and with sourcemaps
`$ gulp sourcemaps`
This taks will start the app with a server in your favourite browser
`$ gulp serve`
This taks will start the app with a server in your favourite browser
`$ gulp serve-prod`
This taks will generate the asset minified
`$ gulp build`
You can also mix task build and sourcemaps to get minified version with sourcemaps
`$ gulp build sourcemaps`
 
### AngularJS Template Cache
 
To enable this feature, run gulp with the following command
 
`$ gulp --usecache`
Note: This flag is recommended to be combined with build task so you can generate the best optimized version for production enviroment.
 
 
ngMaterial
Angular Material

 
This project includes a framework built by Googgle called Angular Material. 
 
The Angular Material project is an implementation of Material Design in Angular.js that provides a set of reusable, well-tested, and accessible UI components based on the Material Design system.
 
Similar to the Polymer project's Paper elements collection, Angular Material is supported internally at Google by the Angular.js, Material Design UX and other product teams.
 
Learn more about this project and its features at https://material.angularjs.org/latest/#/
 
Another useful reference for Material Concepts is at Google Material Design website
 