var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');

var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dotenv = require('dotenv')
var Artist = require('./Artist')

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

// Load envirorment variables
dotenv.config();
console.log(process.env.MONGODB); 
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

var PORT = process.env.PORT || 3000

var _ = require("underscore");

var dataUtil = require("./data-util");
var _DATA
Artist.find({}, function(err, artists){
  if (err) throw err
  _DATA = artists
})

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));


/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */
app.get('/api/artist', function(req, res){
  Artist.find({}, function(err, artists){
    if (err) throw err
    res.send(artists)
  })
})

app.post('/api/artist', function(req, res){

  var artist = new Artist({
    name: req.body.name, 
    label: req.body.label, 
    albums: [],
    genre: req.body.genre,
    IGFollowers: (req.body.IGFollowers),
    ref: req.body.ref,
    src: (req.body.src ? req.body.src : "https://images-na.ssl-images-amazon.com/images/I/41ILE0JVDhL._SX342_QL70_ML2_.jpg")
  })

  artist.save(function(err){
    if(err) throw err
    _DATA.push(artist)
    console.log('new artiste being emitted')
    io.emit('new artist', artist);
    return res.send(`successfully inserted ${artist.name}`)
  })
});

app.post('/api/:id/album', function(req, res){
  Artist.findOne({_id : req.params.id}, function(err, artist){
    if (err) throw err
    if (!artist) res.send("no artist found with that ID")
    else {
    artist.albums.push({
      name: req.body.name,
      year: req.body.year
    })

    artist.save(function(err){
      if(err) throw err
      Artist.find({}, function(err, artists){
        if (err) throw err
        _DATA = artists
      })
      res.send(`successfully added ${req.body.name}`)
    })}
  })
})

app.delete('/api/album/:id/:aid', function(req, res){
  Artist.findOne({_id : req.params.id}, function(err, artist){
    if (err) throw err

    if (!artist) res.send("no artist found with that ID")
    else {
      var anm;

      for (i in artist.albums) {
        if ( artist.albums[i].id === req.params.aid) { 
          anm = artist.albums[i].name
          artist.albums.splice(i, 1); 
          break; 
        }
      }

      artist.save(function(err){
        if(err) throw err
        Artist.find({}, function(err, artists){
          if (err) throw err
          _DATA = artists
        })
        res.send(`successfully deleted ${anm}`)
      })
    }
  })
  
})

app.delete('/api/artist/:id', function(req, res){
  Artist.findByIdAndDelete(req.params.id, function(err, artist){
    if (err) throw err
    if(!artist) res.send("no artist with that id")
    else {
      Artist.find({}, function(err, artists){
        if (err) throw err
        _DATA = artists
      })
      res.send(`${artist.name} deleted`)
    }
  })
})

app.get('/',function(req,res){
  console.log("something please")
  var genres = dataUtil.getAllTags(_DATA);
    res.render('home', {
        data: _DATA,
        genres: genres,
        hlpscrpt: JSON.stringify(_DATA)
    });
})

app.get('/about', function(req, res){
  res.render('about')
})

app.get('/gallery', function(req, res){
  console.log(dataUtil.getAllsrcs(_DATA))
  
  res.render('gallery', {
    srcs: _DATA
  });
})

app.get("/create", function(req, res) {
  res.render('create');
});

app.get("/createAlbum", function(req, res) {
  res.render('createAlbum');
});

app.post('/create', function(req, res) {
  var body = req.body;

  // Transform tags and content 
  body.IGFollowers = parseInt(body.IGFollowers)
  console.log(body.albums)
  var request = require("request");

  var options = {
    method: 'POST',
    url: !process.env.PORT ? 'http://localhost:3000/api/artist' : "https://cmsc389k-artists.herokuapp.com/api/artist",
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        name: body.name,
        label: body.label,
        albums: body.albums,
        genre: body.genre,
        IGFollowers: body.IGFollowers,
        ref: body.ref,
        src: body.src
    }
  };

  request(options, function (error, response, body) {
    //if (error) throw new Error(error);

    console.log(body);
  });

  // Save new blog post
  //_DATA.push(req.body);
  //res.redirect("/");
});

app.post('/createAlbum', function(req, res) {
  var body = req.body;

  // Transform tags and content 
  var request = require("request");

  var options = {
    method: 'POST',
    url: !process.env.PORT ? `http://localhost:3000/api/${body.id}/album` : `https://cmsc389k-artists.herokuapp.com/api/${body.id}/album`,
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        name: body.name,
        id: body.id,
        year: body.year
    }
  };

  request(options, function (error, response, body) {
    //if (error) throw new Error(error);
    console.log(body);
  });

  // Save new blog post
  //_DATA.push(req.body);
  res.redirect("/");
});

/*.post('/api/addArtist', function(req, res) {
  // Save new blog post
  var body = req.body;
  body.albums = body.albums.split(";");

  if(!body.src || body.src.length == 0){
    body.src = "https://images-na.ssl-images-amazon.com/images/I/41ILE0JVDhL._SX342_QL70_ML2_.jpg"
  }
  _DATA.push(req.body);
  //res.redirect("/");
});*/

app.get('/artist/:ref', function(req, res) {
  var genres = dataUtil.getAllTags(_DATA);
  var _ref = req.params.ref;
  var artist = _.findWhere(_DATA, { ref: _ref });
  if (!artist) return res.render('404');
  res.render('artist', {
    artist: artist,
    genres: genres
  });
});

app.get('/genre/:genre', function(req, res) {
  var genres = dataUtil.getAllTags(_DATA);
  var genre = req.params.genre;
  var artists = [];
  _DATA.forEach(function(artist) {
      if (artist.genre == genre) {
          artists.push(artist);
      }
  });
  res.render('home', {
      genre: genre,
      data: artists,
      genres: genres
  });
});

app.get("/api/allArtists", function(req, res) {
  res.send(_DATA);
});

app.get("/api/genres", function(req, res) {
  res.send(dataUtil.getAllTags(_DATA));
});

app.get("/api/genre/:genre", function(req, res) {
  var genre = req.params.genre;
  var artists = [];
  _DATA.forEach(function(artist) {
      if (artist.genre == genre) {
          artists.push(artist);
      }
  });
  res.send(artists);
});

app.get('/api/artist/:ref', function(req, res) {
  var _ref = req.params.ref;
  var artist = _.findWhere(_DATA, { ref: _ref });
  if (!artist) return res.render('404');
  res.send(artist)
});



http.listen(PORT, function() {
  console.log('Listening on port 3000!');
});

app.use(express.static('public'))

io.on('connection', function(socket) {
  console.log('NEW connection.');
});
