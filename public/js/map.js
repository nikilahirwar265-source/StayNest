
async function getCoordinates() {

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${window.place}`
    );

    const data = await response.json();

    if (data.length > 0) {

        const latitude = data[0].lat;
        const longitude = data[0].lon;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        // marker color change
        const redIcon = new L.Icon({
            iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

            shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        // Create map
        const map = L.map('map').setView([latitude, longitude], 9);

        // Add map tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add marker
        const marker = L.marker([latitude, longitude], {
            icon: redIcon
        }).addTo(map);

        marker
            .bindPopup(
                `<b>${window.place}</b><br>Booking Hotel after provide exact location`
            )
            .openPopup();


    } else {
        console.log("Location not found");
    }
}

getCoordinates();


