// Initialize the map
var map = L.map("map").setView([1.2921, 36.8219], 7);

// Add OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Load the GeoJSON file
fetch("kenyan-counties_geo.geojson")
  .then((response) => response.json())
  .then((data) => {

    // Declare variable so we can access it in highlight/reset functions
    var geojsonLayer;

    // Highlight feature when hovering
    function highlightFeature(e) {
      var layer = e.target;
      layer.setStyle({
        weight: 2,
        color: "yellow",
        fillOpacity: 0.7,
      });

      // Bring to front so outline is visible
      layer.bringToFront();

      // Open tooltip automatically on hover
      layer.openTooltip();
    }

    // Reset highlight when mouse leaves
    function resetHighlight(e) {
      geojsonLayer.resetStyle(e.target);
      e.target.closeTooltip();
    }

    // Create GeoJSON layer
    geojsonLayer = L.geoJSON(data, {
      style: {
        color: "blue",
        weight: 1,
        fillColor: "lightblue",
        fillOpacity: 0.5,
      },
      onEachFeature: function (feature, layer) {
        // Get county name (works with both "COUNTY" or "county")
        const name = feature.properties.COUNTY || feature.properties.county;

        if (name) {
          // Add tooltip for hover
        //   layer.bindTooltip(name, {
        //     permanent: false,
        //     direction: "center",
        //     className: "county-label"
        //   });

          // Add popup for click
          layer.bindPopup("County: " + name);
        }

        // Hover interactivity
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
        });
      },
    }).addTo(map);
  })
  .catch((err) => console.error("Error loading GeoJSON:", err));
