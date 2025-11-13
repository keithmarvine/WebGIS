var map = L.map("map").setView([1.2921, 36.8219], 8);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);



var mark = L.marker([1.2921, 36.8219]).addTo(map);

mark.bindPopup("This is Nairobi!").openPopup()



var mark2 = L.marker([-0.180491, 34.740422]).addTo(map);

mark2.bindPopup("This is Kisumu!").openPopup()

var mark3 = L.marker([-4.070935, 39.61762]).addTo(map)

mark3.bindPopup("This is Mombasa!").openPopup()


// Function to handle map click events
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);