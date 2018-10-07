require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var moment = require('moment');
moment().format();

var divider =
    "\n------------------------------------------------------------\n\n";

var command = process.argv[2];

var entries = process.argv.slice(3).join(" ");;


switch(command) {
    case "concert-this":
    concert(); 
    break;
    case "spotify-this-song":
    spotify();
    break;
    case "movie-this":
    movie(entries);
    break;
    case "do-what-it-says":
    doit();
    break;
    default:
    console.log("Invalid Command");
}

function concert() {
    var request = require("request");
    
    request("https://rest.bandsintown.com/artists/" + entries + "/events?app_id=codingbootcamp", function(error, response, body) {
      
      if (!error && response.statusCode === 200) {
        
        for (var i = 0; i < JSON.parse(body).length; i++) {
          var theDate = JSON.parse(body)[i].datetime
          var concertData = JSON.parse(body)[i];
          var location;
          if (JSON.parse(body)[i].venue.region === "") {
              location = JSON.parse(body)[i].venue.city + ", " + JSON.parse(body)[i].venue.country;
            } else if (JSON.parse(body)[i].venue.region === "" || JSON.parse(body)[i].venue.country === "" || JSON.parse(body)[i].venue.country === "-") {
                location = JSON.parse(body)[i].venue.city;
            } else {
                location = JSON.parse(body)[i].venue.city + ", " + JSON.parse(body)[i].venue.region;
            }
            var concertInfo = [
                "Venue name: " + concertData.venue.name,
                "Location: " + location,
                "Date and time: " + moment(theDate).format("MM/DD/YYYY"),
                divider
            ].join("\n\n");
            console.log(concertInfo);
            addText(concertInfo);
        }
      }
    });

}


function spotify() {
    var Spotify = require('node-spotify-api');
 
    var spotify = new Spotify(keys.spotify);
     
    spotify.search({ type: 'track', query: entries }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      for (var j = 0; j < 5; j++) {
    var songData = data.tracks.items[j];
    var songInfo = [
        "Artist: " + songData.artists[0].name,
        "Song name: " + songData.name,
        "Song preview: " + songData.preview_url,
        "Album: " + songData.album.name,
        divider
    ].join("\n\n");
    console.log(songInfo);
    addText(songInfo);
      }
    });
}

function movie(entries) {
    var request = require("request");
    
    if(!entries) {
        entries = "mr+nobody"
    }
    
    request("https://www.omdbapi.com/?t=" + entries + "&y=&plot=short&apikey=trilogy", function(error, response, filmData) {
      
      if (!error && response.statusCode === 200) {

          var movieData = JSON.parse(filmData);
          var movieInfo = [
              "Movie Title: " + movieData.Title,
              "Released Date: " + movieData.Released,
              "OMDB Rating: " + movieData.imdbRating,
              "Rotten Tomatoes: " + movieData.Ratings[1].Value,
              "Country: " + movieData.Country,
              "Language: " + movieData.Language,
              "Plot: " + movieData.Plot,
              "Actors: " + movieData.Actors,
              divider
          ].join("\n\n");
          console.log(movieInfo);
          addText(movieInfo);
      }
    });
}

function doit() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }

        var dataArr = data.split(",");
        command = dataArr[0];
        entries = dataArr[1];
        spotify(command, entries);
      
        console.log(dataArr);
      
      });
}

function addText(result) {
    fs.appendFile("log.txt", result, function(err) {
        if (err) throw err;
    });
}