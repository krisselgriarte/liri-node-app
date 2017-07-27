// Grabbing Twitter and Spotify API key //
var keys = require("./keys.js");

var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var chalk = require("chalk");

// setting the third node argument //
// setting the fourth node argument //
var theCommand = process.argv[2];
var theCommand2 = process.argv.slice(3).join(' ');

// This will switch the command //

switch (theCommand) {
  case "my-tweets":
    tweets();
    break;

  case "spotify-this-song":
    spotify();
    break;

  case "movie-this":
    movie();
    break;

  case "do-what-it-says":
    dothis();
    break;
}

//////////////////////////// THIS WILL GET THE TWITTER API WITH THE RECENT TWEETS //////////////////

function tweets(){
	var client = new Twitter(keys.twitterKeys);
	var params = {screen_name: 'krissy_griarte',
			limit:20
		};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (var i=0; i<tweets.length; i++){
				console.log(chalk.blue.bold(tweets[i].created_at));
				console.log(chalk.bold(tweets[i].text));
				console.log(chalk.red("======================================================================"));
			}
		}
	});
}

////////////////////////////// THIS WILL GET THE SPOTIFY API //////////////////////////////////

function spotify() {
    var spotify = new Spotify(keys.spotifyKeys);
    var spotifySong = process.argv[3];
    spotify.search({
        type: 'track',
        query: spotifySong,
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            var artistNames = function (artist) {
                return artist.name;
            }
            var tracks = data.tracks.items;
            for (var i = 0; i < tracks.length; i++) {
                console.log(chalk.black('=============================================================================='));
                console.log(chalk.red.bold('Artist(s): ' + tracks[i].artists.map(artistNames)));
                console.log(chalk.red.bold('Song name: ' + tracks[i].name));
                console.log(chalk.red.bold('Preview song: ' + tracks[i].preview_url));
                console.log(chalk.red.bold('Album: ' + tracks[i].album.name));
                console.log(chalk.black('=============================================================================='));
            }
        }
    });
}

/////////////////////////////////////// GETTING API REQUEST FOR THE MOVIE///////////////////////////////

function movie() {
    // This will then run a request to the OMDB API with the movie that is selected //
    var queryURL = "http://www.omdbapi.com/?t=" + theCommand2 + "&y=&plot=short&apikey=40e9cece";
    // This line will help us debug against the actual queryURL
    console.log(queryURL);
    request(queryURL, function (error, response, body) {
        // if the request is successful, run this
        if (!error && response.statusCode === 200) {
           console.log(chalk.blue('========================================================================='));
           console.log(chalk.green.bold("Release Year: " + JSON.parse(body).Year));
           console.log(chalk.green.bold("The IMB rating is: " + JSON.parse(body).imdbRating));
           console.log(chalk.green.bold("Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[2].Value));
           console.log(chalk.green.bold("Country where the movie is produced: " + JSON.parse(body).Country));
           console.log(chalk.green.bold("Language of the movie: " + JSON.parse(body).Language));
           console.log(chalk.green.bold("Plot of the movie: " + JSON.parse(body).Plot));
           console.log(chalk.green.bold("Actors in the movie: " + JSON.parse(body).Actors));
           console.log(chalk.blue('=========================================================================='));
        }
    });
}

//////////////////////////////////// DO WHAT IT SAYS FUNCTION /////////////////////////////////////////

function dothis() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }
            console.log(data);
    var dataArr = data.split(",");
    console.log(dataArr);
    theCommand2 = dataArr[1];
        //Switch command //
       switch (dataArr[0]) {
	  case "my-tweets":
	    tweets();
	    break;

	  case "spotify-this-song":
	    spotify();
	    break;

	  case "movie-this":
	    movie();
	    break;

	}
    })
};


