var io = io(),
    map,
    distance = 0,
    station = {lat: 0.0, lng: 0.0},
    trainMarkers =[],
    stationMarkers=[],
    closing = false;
    
    

function initMap() {
  
  map = new google.maps.Map(document.getElementById('map'));
  var bounds = new google.maps.LatLngBounds();
  map.fitBounds(bounds);
io.on('connect', function(){ 
    io.emit("web","auth");
    io.on('station', function(lat,lng){
      station.lat = lat;
      station.lng = lng;
      addStation(lat,lng);
    });
});  

io.on('loc', function(lat,lan,speed){
    addTrain(lat,lan,speed);
    console.log(stationMarkers,trainMarkers);
    var current = new google.maps.LatLng({lat: lat, lng: lan});
    var destination = new google.maps.LatLng(station);
  	bounds.extend(current)
    map.fitBounds(bounds);
  	distance = google.maps.geometry.spherical.computeDistanceBetween(current,destination);
  	console.log(distance)
  	if (distance < 200) {
  	  if(!closing){
  	  io.emit("close",distance);
  	  closing = true;
  	  }
  	}
  	if(closing){
  	  io.emit("open",distance);
  	  closing = false;
  	}
});

}


function addStation(lat,lng) {
  var latLng = {lat: lat, lng: lng};
  if (stationMarkers === undefined || stationMarkers.length == 0 ) {
    var icon = {
    url: "https://static.thenounproject.com/png/733236-200.png", // url
    scaledSize: new google.maps.Size(65, 65),   // scaled size
    origin:     new google.maps.Point(0,0),    // origin
    anchor:     new google.maps.Point(0,0)    // anchor
    };
    var marker =  new google.maps.Marker({
  	position: latLng,
  	map: map,
  	title: "Train Station",
  	icon: icon
  	});
    stationMarkers.push(marker);
  	marker.addListener("click",function() {
  	  var info = new google.maps.InfoWindow();
  		if (info.marker != this) {
        info.marker = this;
        info.setContent('<div>' + this.title + '</div>');
        info.open(map, this);
  
        info.addListener('closeclick',function(){
          info.setMarker = null;
        });
      }
  	});
  	map.panTo(latLng);
  	map.setZoom(20);
  	bounds = new google.maps.LatLngBounds();
  }
  stationMarkers[0].setPosition(latLng);
  stationMarkers[0].setTitle("Train Station");
}

function addTrain(lat,lng,speed) {
  var latLng = {lat: lat, lng: lng};
  if(trainMarkers === undefined || trainMarkers.length == 0){
  var icon = {
    url: "https://cdn4.iconfinder.com/data/icons/circle-map-pins/512/map_pin_destination_location_adress_train_metro_subway-512.png", // url
    scaledSize: new google.maps.Size(65, 65), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };
  var marker =  new google.maps.Marker({
  	position: latLng,
  	map: map,
  	title: "Speed: "+speed,
  	icon: icon
  	});
    trainMarkers.push(marker);
  	marker.addListener("click",function() {
  	  var info = new google.maps.InfoWindow();
  		if (info.marker != this) {
        info.marker = this;
        info.setContent('<div>' + this.title + '</div>');
        info.open(map, this);
        info.addListener('closeclick',function(){
          info.setMarker = null;
        });
      }
  	});
  	if (stationMarkers === undefined || stationMarkers.length == 0 ) {
  	  map.panTo(latLng);
    	map.setZoom(20);
  	  bounds = new google.maps.LatLngBounds();
  	}
  	
  }
  trainMarkers[0].setPosition(latLng);
  trainMarkers[0].setTitle("Speed: "+speed);
}