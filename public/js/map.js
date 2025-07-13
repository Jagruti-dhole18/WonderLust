// // public/js/map.js

// function initMap(lat, lng, title, locationText) {
//   const map = L.map('map').setView([lat, lng], 13);

//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
//   }).addTo(map);

//   L.marker([lat, lng]).addTo(map)
//     .bindPopup(`<b>${title}</b><br>${locationText}`)
//     .openPopup();
// }

function initMap(lat, lng, title, locationText) {
  const map = L.map('map').setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // console.log(coordinates);
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${title}</b><br>${locationText}`)
    .openPopup();
}

