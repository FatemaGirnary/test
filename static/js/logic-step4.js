// Creating the map object
let myMap = L.map("map", {
  center: [27.96044, -82.30695],
  zoom: 7,
});

// Adding the tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Load the GeoJSON data.
let geoData =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/ACS-ED_2014-2018_Economic_Characteristics_FL.geojson";

// Get the data with d3.
d3.json(geoData).then(function (data) {
  // Create a new choropleth layer.
  let geojson = L.choropleth(data, {
    // Define which property in the features to use.
    valueProperty: "DP03_16E",

    // Set the colour scale.
    scale: ["#ffffb2", "#b10026"],

    // The number of breaks in the step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border colour
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8,
    },

    // Binding a popup to each layer
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "<strong>" +
          feature.properties.NAME +
          "</strong><br /><br />Estimated employed population with children age 6-17: " +
          feature.properties.DP03_16E +
          "<br /><br />Estimated Total Income and Benefits for Families: $" +
          feature.properties.DP03_75E
      );
    },
  }).addTo(myMap);

  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let limits = geojson.options.limits;
    let colors = geojson.options.colors;
    let labels = [];

    // Add the minimum and maximum.
    let legendInfo =
      "<h1>Population with Children<br />(ages 6-17)</h1>" +
      '<div class="label s">' +
      '<div class="min">' +
      limits[0] +
      "</div>" +
      '<div class="max">' +
      limits[limits.length - 1] +
      "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>');
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
});
