

const key = mapToken;

// GeoJSON gives [lng, lat]
const lng = listingCoords[0];
const lat = listingCoords[1];

const map = L.map("map").setView([lat, lng], 10);

L.tileLayer(
  `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,
  {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 2,
    maxZoom: 18,
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">Pradeep</a>',
    crossOrigin: true,
  }
).addTo(map);

// custom red marker color
const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Add marker
L.marker([lat, lng],{icon:redIcon})
  .addTo(map)
  .bindPopup(`<b>Locaton</b><br>${locationText}`)
  .openPopup();
