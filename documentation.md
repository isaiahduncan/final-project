
# Musical Artists Page

---

Name: Isaiah Duncan

Date: 5/12/20

Project Topic: Musical Artists

Heroku URL: https://cmsc389k-artists.herokuapp.com/  I really tried and spent a lot of time figuring out how to deploy this app but i could not figure it out 
Local Host URL: http://localhost:3000/

---

### 2. Live Updates 
I incorperated ioSockets on the create page. Upon clicking the button to add a new artist, A line of text shows up telling the user that their artist was added. Eg. if I were adding Usher, the text would say "Usher was added" and all of the text fields would be cleared.

### 3. View Data
  5 HTML Pages: 
  `/`, `/gallery`, `artist/:ref`, `/create`, `/createAlbum`

  About Page: `/about`

### 4. API Endpoints
1. Get Endpoints -> `/api/artist` (all information can be found through this request) , `/api/genres` , `/api/genre/:genre` , `/api/artist/:ref` (artists' refs can be found the /api/artist get request) 
2. Post Endpoints -> `/api/artist` , `/api/:id/album` (artist id can be found on the home page or on the artist's page)  
3. Delete Endpoints -> `/api/artist/:id` (artist id can be found on home page or artist's page) , `/api/album/:id/:aid` (album id can be found on the artist's page) 

### 5. Modules
1. data-util.js

### 6. New Node Packages Used
1. JSHint - helps you to find errors in code
2. nodemon - makes it so that you don't need to restart the server when you make changes to the app


### Below is some important documentation from the midterm project


### 1. Data Format and Storage

Data point fields:
- `Field 1`:     name       `Type: String`
- `Field 2`:     label       `Type: String`
- `Field 3`:     albums       `Type: [Album]`
- `Field 4`:     genre       `Type: String`
- `Field 5`:     IGFollowers       `Type: Int`
- `Field 6`:     ref       `Type: String`
- `Field 7`:     src       `Type: String`

Schema: 
```javascript
{
  "name":"Ariana Grande",
  "label":"Republic Records",
  "albums":[{"name" : "Yours Truly", "year": 2013 }],
  "genre":"Pop",
  "IGFollowers":179000000,
  "ref":"Ariana-Grande",
  "src": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Sweetener_album_cover.png/220px-Sweetener_album_cover.png"
}
```

### 2. Add New Data

HTML form routes: `/create`, `/createAlbum`

POST endpoint routes: `/api/artist`, `api/:id

Example Node.js POST request to `/api/artist` endpoint: 
```javascript
  var request = require("request");

  var options = {
    method: 'POST',
    url: 'http://localhost:3000/api/artist',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        name: "Lil Wayne",
        label: "Cash Money Records",
        genre: "Hip-Hop",
        IGFollowers: 12345678,
        ref: "lil-wayne",
        src: "https://images-na.ssl-images-amazon.com/images/I/61-FdRTON%2BL._SL1400_.jpg"
    }
  };

  request(options, function (error, response, body) {
    console.log(body);
  });
```

Example Node.js POST request to `/api/:id/album` endpoint: 
```javascript
var request = require("request");

var options = {
  method: 'POST',
  url: `http://localhost:3000/api/5eb89b596547091d47df9998/album`,
  headers: {
      'content-type': 'application/x-www-form-urlencoded'
  },
  form: {
      name: "1989",
      id: "5eb89b596547091d47df9998",
      year: 2014
  }
};

request(options, function (error, response, body) {
  console.log(body);
});
```

### 3. View Data

GET endpoint routes: 
+ `/api/artist`
+ `/api/allArtists`
+ `/api/genres`
+ `/api/artist/(artist.ref)` -> eg. `/api/artist/Ariana-Grande`
+ `/api/genre/genre-name` -> eg. `/api/genre/R&B`

### 4. Search Data

Search Field: name

### 5. Navigation Pages

Navigation Filters
1. Hip-Hop -> `  /genre/Hip-Hop  `
2. Pop -> `  /genre/Pop  `
3. R&b -> `  /genre/R&B  `
4. Gospel -> `  /genre/Gospel  `
5. Reggae -> `  /genre/Reggae  `
6. Any new genres that you add when creating a new artist -> ` /genre/genreName `