var map;
// Create a new blank array for all the listing markers
var markers =[];
// Create locations to appear on map
var locations =[
 {
  title: 'Vancouver Aquarium',
  location: {lat: 49.300814, lng: -123.130908},
  image: 'images/VancouverAquarium.jpg',
  content:'Popular kid-friendly attraction with local & exotic aquatic life'
  },
 {
  title: 'Granville Island Market',
  location: {lat: 49.272581, lng: -123.135076},
  image: 'images/GranvilleIsland.jpg',
  content:'Public Market of fresh seafood and attraction of thriving artist community'
  },
 {
  title: 'Canada Place',
  location: {lat: 49.289014, lng: -123.111078},
  image: 'images/CanadaPlace.jpg',
  content:'Extraordinary lookout for Vancouver'
 },
 {
   title: 'English Bay Beach',
   location: {lat: 49.286443, lng: -123.143498},
   image: 'images/EnglishBay.jpg',
   content:'Bustling Beach with lots of outdoor activities'
  },
  {
    title: 'Science World',
    location: {lat: 49.273593, lng: -123.103845},
    image: 'images/ScienceWorld.jpg',
    content:'Amazing science displays for children and adults to learn'
   },
   {
    title: 'Vancouver Public Library',
    location: {lat: 49.279859, lng: -123.115679},
    image: 'images/VancouverPublicLibrary.jpg',
    content:'A grand library with lots of books to provide education and knowledge'
  },
];

//Create initMap function for Google map

function initMap() {
  map = new google.maps.Map(document.getElementById('map'),{
  center: {lat: 49.284276, lng: -123.118337},
  zoom: 13
});

var largeInfowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();
for(var i=0; i < locations.length; i++){
// Get the position from the the location array
 var position = locations[i].location;
 var title = locations[i].title;
 var content = locations[i].content;
// Create a marker per location, and put into markers array
 var marker = new google.maps.Marker({
   map: map,
   position: position,
   title: title,
   content: content,
   animation: google.maps.Animation.DROP,
   id: i,
 });
 //Push the marker to our array of markers
 markers.push(marker);
 //Extend the boundaries of the map for each marker
 bounds.extend(marker.position);
 //Create an onclick event to open an infowindow at each marker
 marker.addListener('click',function(){
   populateInfoWindow(this, largeInfowindow);
 });
}
map.fitBounds(bounds);

//Create "showListings" and "hideListings" button
document.getElementById('show-listings').addEventListener('click',showListings);
document.getElementById('hide-listings').addEventListener('click',hideListings);
}
function populateInfoWindow(marker, infowindow){
 if(infowindow.marker != marker){
   infowindow.marker = marker;
   infowindow.setContent('<div>'+'<b>'+ marker.title +'</b>'+'</div>'+'<div>'+ marker.content +'</div>');
   infowindow.open(map,marker);
//Make sure the marker property is cleared if the infowindow is  closed
   infowindow.addListener('closeclick',function(){
     infowindow.setMarker(null);
   })
 }
}
//This function will loop through the listings and show them all
function showListings(){
 var bounds = new google.maps.LatLngBounds();
 //Extend the boundaries of the map for each marker and display the marker
 for (var i=0; i < markers.length; i++){
   markers[i].setMap(map);
   bounds.extend(markers[i].position);
 }
map.fitBounds(bounds);
}
//This function will loop through the listings and hide them all
function hideListings(){
 for (var i=0; i < markers.length; i++){
   markers[i].setMap(null);
 }
}
//Create the Location variable
var Location = function(data, i){
  this.title = data.title;
  this.content = data.content;
  this.id = i;

}
//Create ViewModel function
var ViewModel = function(){
  var self = this;
  self.searchInput = ko.observable('');

  this.locationList = ko.observableArray([]);

  locations.forEach(function(locationsItem, i){
  self.locationList.push(new Location(locationsItem, i));
  });
//This function will trigger the "click" function associated with location list
  this.setLocation = function(location) {
    var index = location.id;
    google.maps.event.trigger(markers[index],"click");
  };
//Search filter to make it easy to find a location
  this.searchFilter = ko.computed(function() {
    var searchInput = self.searchInput().toLowerCase();
    var foundLocations = ko.observableArray([]);
//The marker becomes visible with matching keywords
    if (!searchInput) {
      markers.forEach(function(marker) {
        marker.setVisible(true);
      });
      return self.locationList();

    } else {
      self.locationList().forEach(function(location, i) {
        var title = location.title.toLowerCase();
        var found = title.indexOf(searchInput);
        if (found > -1) {
          foundLocations.push(location);
          markers[i].setVisible(true);
        } else {
           markers[i].setVisible(false);
        }
      });
      return foundLocations();

    };

  });
}

ko.applyBindings(new ViewModel());
