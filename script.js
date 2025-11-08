mapboxgl.accessToken = 'pk.eyJ1IjoiYXZlcnlkYXZpcyIsImEiOiJjbWg5cmp2cGswcjViMm5vbzB0b2p3OGh6In0.4ZRnBeMTyJr9Aed0xQ04xw';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/averydavis/cmh9rqtvv00qi01r54itfb3lj', // your Style URL goes here
  center: [-122.2727, 37.8715], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 11 // starting zoom
});

map.on('load', function () {
  map.addSource('points-data', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/averydavis17/BAHA-Map/refs/heads/main/map%20(2).geojson'
  });

  map.addLayer({
    id: 'points-layer',
    type: 'circle',
    source: 'points-data',
    paint: {
      'circle-color': '#583711',
      'circle-radius': 6,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });

   map.addLayer({
    id: 'points-layer-hover',
    type: 'circle',
    source: 'points-data',
    paint: {
      'circle-radius': 15,          
      'circle-color': '#FFD700',     
      'circle-opacity': 0.5          
    },
    filter: ['==', 'Landmark', '']   // start hidden
  });

  // Show the glow on hover
  map.on('mouseenter', 'points-layer', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const name = e.features[0].properties.Landmark;
    map.setFilter('points-layer-hover', ['==', 'Landmark', name]);
  });

  // Hide the glow when not hovering
  map.on('mouseleave', 'points-layer', () => {
    map.getCanvas().style.cursor = '';
    map.setFilter('points-layer-hover', ['==', 'Landmark', '']);
  });

  map.on('click', 'points-layer', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;

      map.flyTo({
      center: coordinates,
      zoom: 13,     
      speed: 0.6,    
      curve: 1,      
      essential: true
    });
          const popupContent = `
            <div>
                <h3>${properties.Landmark}</h3>
                <p><strong>Address:</strong> ${properties.Address}</p>
                <p><strong>Architect & Date:</strong> ${properties.Architect_Date}</p>
                <p><strong>Designated:</strong> ${properties.Designated}</p>
                ${properties.Link ? `<p><a href="${properties.Link}" target="_blank">More Information</a></p>` : ''}
                ${properties.Notes ? `<p><strong>Notes:</strong> ${properties.Notes}</p>` : ''}
            </div>
        `;

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);     
  });

});