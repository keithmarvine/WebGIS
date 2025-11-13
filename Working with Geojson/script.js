// Initialize the map
var map = L.map("map").setView([1.2921, 36.8219], 7);

// Add OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let geojsonData;   // Store original GeoJSON
let geojsonLayer;  // Current layer on map

// Load the GeoJSON file
fetch("kenyan-counties_geo.geojson")
  .then((response) => response.json())
  .then((data) => {
    geojsonData = data;  // Keep a copy of the original data

    addGeoJSONLayer(data); // Add initial layer
  })
  .catch((err) => console.error("Error loading GeoJSON:", err));

// Function to add GeoJSON layer
function addGeoJSONLayer(data) {
  geojsonLayer = L.geoJSON(data, {
    style: {
      color: "blue",
      weight: 1,
      fillColor: "lightblue",
      fillOpacity: 0.5,
    },
    onEachFeature: function (feature, layer) {
      const name = feature.properties.COUNTY || feature.properties.county;

      if (name) {
        // Tooltip on hover
        // layer.bindTooltip(name, {
        //   permanent: false,
        //   direction: "center",
        //   className: "county-label",
        // });

        // Popup on click
        layer.bindPopup("County: " + name);
      }

      // Event handlers
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToCounty,
      });

      // Restore map when popup is closed
      layer.on("popupclose", restoreMap);
    },
  }).addTo(map);
}

// Highlight on hover
function highlightFeature(e) {
  const layer = e.target;
  layer.setStyle({
    weight: 2,
    color: "yellow",
    fillOpacity: 0.7,
  });
  layer.bringToFront();
  layer.openTooltip();
}

// Reset highlight
function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
  e.target.closeTooltip();
}

// Zoom to clicked county and hide others
function zoomToCounty(e) {
  const layer = e.target;

  // Zoom to bounds
  map.fitBounds(layer.getBounds());

  // Remove all other counties
  geojsonLayer.eachLayer(function (l) {
    if (l !== layer) {
      map.removeLayer(l);
    }
  });

  // Open popup
  layer.openPopup();
}

// Restore map to original state
function restoreMap() {
  // Remove current layer
  map.removeLayer(geojsonLayer);

  // Add back the full GeoJSON layer
  addGeoJSONLayer(geojsonData);

  // Reset map view
  map.setView([1.2921, 36.8219], 7);
}
