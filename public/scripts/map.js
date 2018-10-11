var io = io(),
    map,
    markers = [];

function initMap() {
  
  map = new google.maps.Map(document.getElementById('map'));

io.on('connection', function(socket){
    console.log("got a connection")
});  

io.on('loc', function(lat,lan,speed){
    clearMarkers();
    addMarker(lat,lan,speed);
  	map.panTo({lat: lat, lng: lan});
  	map.setZoom(20);
  	
});

  
  var bounds = new google.maps.LatLngBounds();
  map.fitBounds(bounds);

  var info = new google.maps.InfoWindow({
  	content:"sfjsadfksjfksjfksadjfklasjf"
  });

  

  
}

function clearMarkers() {
  markers.forEach(function (marker) {
    marker.setMap(null);
  });
  markers=[];
}

function addMarker(lat,lan,speed) {
  var icon = {
    url: "https://cdn4.iconfinder.com/data/icons/circle-map-pins/512/map_pin_destination_location_adress_train_metro_subway-512.png", // url
    scaledSize: new google.maps.Size(65, 65), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };
  var marker =  new google.maps.Marker({
  	position: {lat: lat, lng: lan},
  	map: map,
  	title: "Speed: "+speed,
  	icon: icon
  	});
    markers.push(marker);
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
}