const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log('Hello from client side: ', locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoiam9uYXNzY2htZWR0bWFubiIsImEiOiJjam54ZmM5N3gwNjAzM3dtZDNxYTVlMnd2In0.ytpI7V7w7cyT1Kq5rT9Z1A';

var map = new mapboxgl.Map({
  container: 'map', // it will put map on container with 'id = map'
  style: 'mapbox://styles/jonasschmedtmann/cjvi9q8jd04mi1cpgmg7ev3dy',
  scrollZoom: false, // it soes not change zoom level when we scroll above map
  center: [-118.113491, 34.111745],
  zoom: 5,
  //   interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom', // bottom of pin will be located at gps location
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup with location day and name
  new mapboxgl.Popup({
    offset: 30, // to avoid overlap with marker
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

// it moves & zooms map right to bounds to fit markers
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
