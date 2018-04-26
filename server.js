// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var port  	 = process.env.PORT || 8080; 				// set the port
var request = require('request');

var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var router = express.Router();              // get an instance of the express Router
app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.get('/server/geoCode', function(req, res) {
    
    var location = req.query['location-input'];
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURI(location) + "&key=YOUR_API_KEY";
	request(url, function(err, response, body){
	if (err) { 
	console.log('error');
	res.send(err); 
	}
	else{
        var responseJSON = JSON.parse(body);
        if(responseJSON['results'][0]){
        var data = {
          'lat' : responseJSON['results'][0]['geometry']['location']['lat'],
          'lng' : responseJSON['results'][0]['geometry']['location']['lng']
        };
            res.send(data);
        }
        else{
            console.log("in");
            res.send(body);
        }
	}
});
});

app.get('/server/placesApi', function(req, res) { 
    var requestJSON = req.query;
    console.log(requestJSON);
    var lati = requestJSON['lat'];
    var lng = requestJSON['lng'];
    var radius = requestJSON['distance'];
    var type = requestJSON['category'];
    var keyword = requestJSON['keyword'];

    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + encodeURI(lati) + "," + encodeURI(lng) + "&radius=" + encodeURI(radius) + "&type=" + encodeURI(type) + "&keyword=" + encodeURI(keyword) + "&key=YOUR_API_KEY";
    
    console.log(url);
	request(url, function(err, response, body){
        if (err) { 
        console.log('error');
        res.send(err); 
        }
        else{
            res.send(body);
        }
    });
});

app.get('/server/pageResults', function(req, res) {    
    var requestJSON = req.query;
    var nextPageToken = requestJSON['pageToken'];
    
    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=" + encodeURI(nextPageToken) + "&key=YOUR_API_KEY";    
	request(url, function(err, response, body){
        if (err) { 
        console.log('error');
        res.send(err); 
        }
        else{
            res.send(body);
        }
    });
});

app.get('/server/placeDetails', function(req, res) {
    var place_id = req.query.place_id;
    console.log("in");
    var url = "https://maps.googleapis.com/maps/api/place/details/json?" + "&placeid=" + encodeURI(place_id) + "&key=YOUR_API_KEY";
    console.log(url);
	request(url, function(err, response, body){
        if (err) { 
        console.log('error');
        res.send(err); 
        }
        else{
            console.log("got place details");
            res.send(body);
        }
    });
});

app.get('/server/yelpBestMatch', function(req, res) {
    var requestJSON = req.body;
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization' : "Bearer _InMwfd2FUi3zciaBx39GupR4SyO-SgDJvDnhSV3RPZaAUF-vEqtTqEUj8pgBkG6eEx8Gbcm1O7c09qHqmI854lt62WGXThC6wWOEdlvI_MboJGLyYhUWOJeb0K8WnYx"
    };
    
    var name = req.query.name;
    var city = req.query.city;
    var state = req.query.state;
    var country = req.query.country;
    var address_1 = req.query.address_1;
    var postal_code = req.query.postal_code;
    var lat = req.query.lat;
    var lng = req.query.lng;
    
    var url = "https://api.yelp.com/v3/businesses/matches/best?name=" + encodeURI(name)+ "&city=" + encodeURI(city) + "&state=" + encodeURI(state) + "&country=" + encodeURI(country) + "&address1=" + encodeURI(address_1) + "&postal_code=" + encodeURI(postal_code) +  "&latitude=" + encodeURI(lat) + "&longitude=" + encodeURI(lng);
    
    console.log(url);
    
	request({headers : headers, url:url}, function(err, response, body){
        if (err) { 
        console.log('error');
        res.send(err); 
        }
        else{            
            res.send(body);
        }
    });
});


app.get('/server/yelpReviews', function(req, res) {
    var id = req.query.b_id;
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization' : "Bearer _InMwfd2FUi3zciaBx39GupR4SyO-SgDJvDnhSV3RPZaAUF-vEqtTqEUj8pgBkG6eEx8Gbcm1O7c09qHqmI854lt62WGXThC6wWOEdlvI_MboJGLyYhUWOJeb0K8WnYx"
    };
    var url = "https://api.yelp.com/v3/businesses/" + encodeURI(id) + "/reviews";
    console.log(url);
	request({headers : headers, url:url}, function(err, response, body){
        if (err) { 
        console.log('error');
        res.send(err); 
        }
        else{
            console.log("got reviews");
            console.log(body);
            res.send(body);
        }
    });
});

app.listen(port);
console.log("App listening on port " + port);

