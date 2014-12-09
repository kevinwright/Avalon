![](http://avalon-rpg.com:3000/img/logo_black.png)

Getting Started
---------------

Get [node](http://nodejs.org/) (from [package-manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)) and [npm](https://www.npmjs.org/) if not installed together.

You'll also need [grunt](http://gruntjs.com/) to compile lesscss and run a watcher for livereload.

```shell
  > npm install
  > npm install -g grunt-cli 

  Then start with
  > bin/www
  or
  > npm start

  And to compile, just run
  > grunt
```

Structure
---------

App.js loads everything. It refers to routes defined in the /routes folder.
The routes serve content immediately or refer to the controllers for more logic.

Jade views are in /views. There is a layout.jade that each page renders and a directory for /includes.
You can set title, description, keywords in the `block head` as you can see in /views/help/index.

For design, take a look at public/styles.html in a browser, but it's still in HTML and not jade for now.
You'll get an idea of what you can do with each class.



Style
-----

* Use 2 spaces.


Making Emails
-------------

1. Copy template from public/original/template.html to public/original/xxx.html
2. Edit content as you like. Open it in a browser to preview.
3. Copy paste the full html to http://zurb.com/ink/inliner.php
4. Make a new empty HTML file in public/email/xxx.html
5. Copy over the data from ink inliner to your new HTML file.

Links
-----

* [Javascript](http://learnxinyminutes.com/docs/javascript/)
* [Node API](http://nodejs.org/api/)
* [Production Practices](http://www.joyent.com/developers/node)
* [Less](http://lesscss.org/)
* [Markdown](https://help.github.com/articles/markdown-basics/)
* [Jade](http://jade-lang.com/)
* [Express](http://expressjs.com/api.html)