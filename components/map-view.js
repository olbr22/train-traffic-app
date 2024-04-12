/* eslint-disable */
// Third-party library code without linting
/* global L */

import "../leaflet/leaflet.min.js";
import '../leaflet/leaflet.markercluster.js';

import trains from "../models/trains.js";
import { calculateDelay } from "../utils.js";

export default class MapView extends HTMLElement {
    constructor() {
        super();

        this.map = null;
        this.train = "";
        this.trains = [];
        this.station = "";
        this.heatmapLayer = {};
        this.markerClusterGroup = {};
        this.markers = [];
    }

    static get observedAttributes() {
        return ["train", "station"];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        this[property] = newValue;
    }

    async connectedCallback() {
        this.station = this.getAttribute("station");
        this.train = JSON.parse(this.getAttribute("train"));
        this.trains = await trains.delayedTrainsInfo();
        this.innerHTML = `
        <div id="map" class="map"></div>
        <div class="map-icon-controllers">
            <div class="icon heatmap-icon" id="heatmap-toggle"></div>
            <div class="icon my-location-icon" id="my-location"></div>
        </div>
        `;

        this.renderMap();

        this.heatmapLayer = this.createHeatmapLayer();

        // Attach click event listener to heatmap toggle button
        document.getElementById('heatmap-toggle').addEventListener('click', () => {
            // Toggle heatmap layer visibility
            if (this.map.hasLayer(this.heatmapLayer)) {
                this.map.removeLayer(this.heatmapLayer);
            } else {
                this.heatmapLayer.addTo(this.map);
            }
            document.getElementById('heatmap-toggle').classList.toggle('show');
        });
    }

    renderMap() {
        const viewGeoCoordinates = [62.93161, 17.77646];
        const zoomLevel = 4;

        this.map = L.map('map').setView(viewGeoCoordinates, zoomLevel);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 15,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.renderMarkers();

        this.renderLocation();

        if (this.station !== "$wildcard") {
            this.showStationOnMap();
        }
    }

    renderMarkers() {
        this.markerClusterGroup = L.markerClusterGroup();

        for (let train of this.trains) {
            let coordinates = train.GeoLocation;
            let latitude = parseFloat(coordinates[1]);
            let longitude = parseFloat(coordinates[0]);
            let stationFrom = train.From;
            let stationDestination = train.To;
            let delay = calculateDelay(
                train.AdvertisedTimeAtLocation, train.EstimatedTimeAtLocation
            );

            let icon = null;
            let popupMsg = `
            <div class="map-font">
                <div class="map-font-bold">
                    <div class="line-through">${train.AdvertisedTimeAtLocation}</div>
                    <div>${train.EstimatedTimeAtLocation}</div>
                </div>
                <b>Från:</b> ${stationFrom}<br>
                <b>Till:</b> ${stationDestination}<br>
                <b>Försening:</b> ${delay.hours} timmar ${delay.minutes} minuter
            </div>`;
            let exploreMsg = `
            <div class="explore-station" data-latitude="${latitude}"
            data-longitude="${longitude}" data-hours="${delay.hours}"
            data-minutes="${delay.minutes}">
            Utforska staden -> <span class="compass-icon"></span>
            </div>`;

            if (delay.hours > 0 || delay.minutes > 15) {
                icon = "./images/local-see-icon.svg";
                popupMsg += exploreMsg;
            } else {
                icon = "./images/railway-station.svg";
            }

            let stationMarker = L.icon({
                iconUrl:      icon,
                iconSize:     [24, 24],
                iconAnchor:   [12, 12],
                popupAnchor:  [0, 0]
            });

            let marker = L.marker([latitude, longitude], {icon: stationMarker}).bindPopup(popupMsg);

            this.markers.push(marker);
            this.markerClusterGroup.addLayer(marker);
        }

        this.map.addLayer(this.markerClusterGroup);

        // Attach click event listener to explore station links using event delegation
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('compass-icon')) {
                console.log("Explore station clicked");

                const clickedMarker = document.querySelector('.explore-station');
                // Retrieve latitude and longitude of the clicked marker
                let latitude = parseFloat(clickedMarker.getAttribute('data-latitude'));
                let longitude = parseFloat(clickedMarker.getAttribute('data-longitude'));
                let hours = parseFloat(clickedMarker.getAttribute('data-hours'));
                let minutes = parseFloat(clickedMarker.getAttribute('data-minutes'));
                let totalDistance = (hours * 60 + minutes) * 90;
                const circleRadius = totalDistance / 2;

                const targetLocation = [latitude, longitude];
                const zoomLevel = 13;
                // Add a circle at the marker's location

                L.circle(targetLocation, {
                    color: 'green',
                    fillColor: 'green',
                    fillOpacity: 0.1,
                    radius: `${circleRadius}`
                }).addTo(this.map);

                // Close marker's popup
                for (let marker of this.markers) {
                    if (marker._latlng.lat === latitude && marker._latlng.lng === longitude) {
                        marker.closePopup();
                    }
                }

                this.map.setView(targetLocation, zoomLevel);
            }
        });
    }

    createHeatmapLayer() {
        // Data to be used as the heatmap layer
        const data = {
            max: 5,
            data: []
        };

        // Transform the data to the format required by the heatmap
        let stationCounts = {};
        // Count delayed trains at each station

        for (let train of this.trains) {
            let station = train.From;
            let latitude = parseFloat(train.GeoLocation[1]);
            let longitude = parseFloat(train.GeoLocation[0]);

            if (station in stationCounts) {
                stationCounts[station].count++;
            } else {
                stationCounts[station] = {
                    count: 1,
                    latitude: latitude,
                    longitude: longitude
                };
            }
        }

        for (let station in stationCounts) {
            let latitude = stationCounts[station].latitude;
            let longitude = stationCounts[station].longitude;
            let count = stationCounts[station].count;

            data.data.push({lat: latitude, lng: longitude, count: count});
        }

        // Configure the heatmap layer
        const cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            "radius": 40,
            "maxOpacity": .8,
            // scales the radius based on map zoom
            "scaleRadius": false,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": false,
            // which field name in your data represents the latitude - default "lat"
            latField: 'lat',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'lng',
            // which field name in your data represents the data value - default "value"
            valueField: 'count'
        };

        // Create a heatmap layer
        const heatmapLayer = new HeatmapOverlay(cfg);

        heatmapLayer.setData(data);

        return heatmapLayer;
    }

    renderLocation() {
        let locationMarker = L.icon({
            iconUrl:      "leaflet/location.png",
            iconSize:     [24, 24],
            iconAnchor:   [12, 12],
            popupAnchor:  [0, 0]
        });

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    this.geolocation = [latitude, longitude];
                    // Add a marker at the current location
                    L.marker(
                        [latitude, longitude],
                        {icon: locationMarker}
                    ).addTo(this.map);
                });

            // Attach click event listener to heatmap toggle button
            document.getElementById('my-location').addEventListener('click', () => {
                const zoomLevel = 9;
                // it takes time to get positions lat and long
                // so this a fallback if the geolocation is not set or is not available
                // to the default coordinates of Stockholm

                if (this.geolocation === undefined) {
                    this.geolocation = [59.334591, 18.063240];
                }
                this.map.flyTo(this.geolocation, zoomLevel);
            });
        }
    }

    showStationOnMap() {
        const longitude = parseFloat(this.station.split("&")[0]);
        const latitude = parseFloat(this.station.split("&")[1]);
        const targetLocation = [latitude, longitude];
        const zoomLevel = 9;

        this.map.flyTo(targetLocation, zoomLevel);
    }
}
