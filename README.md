# codenames

This project is a basic online implementation of the board game Codenames by Czech Games Edition, purely for 
fun and in no way endorsed by Vlaada Chvátil or Czech Games. This is simply one of my pet projects to work 
on when I want to try out something new.

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

The default gulp task will re-build both the haggis22.js and haggis22.css files and put them in the `build` folder.

```
gulp 
```
or
```
gulp default
```


## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details

