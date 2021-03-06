﻿# codenames

This project is a basic online implementation of the board game Codenames by Czech Games Edition, purely for 
fun and in no way endorsed by Vlaada Chvátil or Czech Games. This is simply one of my pet projects to work 
on when I want to try out something new.

I own their game (two copies! one to keep and one to give away) 
and heartily recommend it - it's simple and fun. You can learn more 
about it at their website at http://czechgames.com/en/codenames/.

### Demo

You can try this code out online at https://www.haggis22.com. It runs on an Ubuntu deployment of Node.js,
with a MongoDB back-end.

### Prerequisites

Depends up on AngularJS version 1.x to run. Needs Gulp to rebuild the project if changes are made.
Uses my own haggis22 utilities, available at https://github.com/haggis22/haggis22

```
npm install gulp
```

### Building

To build the project, download the source from gitub

```
git clone https://github.com/haggis22/codenames.git
```

Node and npm are required - with them installed you can set up the dev dependencies with a basic install from the package.json

```
npm install
```

The default gulp task will build the server and client files and put them in the `build` folder.

```
gulp 
```
or
```
gulp default
```


## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details

