// console.log(mapToken)
mapboxgl.accessToken = mapToken;
// console.log(mapToken)
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard", // Use the standard style for the map
  // projection: "globe", // display the map as a globe
  center: coordinates, // center the map on this longitude and latitude
  zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
});


// console.log(coordinates)
// console.log(Location)
const marker = new mapboxgl.Marker({color: "red"}) // Create a red marker 
  .setLngLat(coordinates) // Set marker at specified longitude and latitude
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(`<h3>${Location}</h3><p>Exact Location provided after booking</p>`)
  )
  .addTo(map); // Add the marker to the map


