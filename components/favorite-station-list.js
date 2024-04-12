import userData from "../models/user-data.js";

export default class FavoriteStationList extends HTMLElement {
    constructor() {
        super();
        this.favoriteStations = [];
    }

    // Function to remove duplicates based on the "station" key
    removeDuplicates(arr) {
        const seen = new Set();

        return arr.filter(obj => {
            const station = JSON.parse(obj.artefact).station;

            if (!seen.has(station)) {
                seen.add(station);
                return true;
            }
            return false;
        });
    }

    async connectedCallback() {
        const data = await userData.get();

        this.favoriteStations = this.removeDuplicates(data);
        this.render(this.favoriteStations);

        this.container = document.querySelector(".favorite-station-container");
    }

    async render(favorites) {
        // Convert a JavaScript object into a string
        const list = favorites.map((station) =>
            `<div class="favorite-station-container">
            <favorite-station station = '${JSON.stringify(station)}'>
            </favorite-station>
            <favorite-station-remover station = '${JSON.stringify(station)}'>
            </favorite-station-remover>
        </div>
        `).join("");
        // The JSON.stringify() static method converts a JavaScript value to a JSON string

        if (list) {
            this.innerHTML = `${list}`;
        } else {
            this.innerHTML = `
            <div class="favorite-station-container">
                <p>Det finns inga favorit stationer att visa.</p>
            </div>
        `;
        }
    }
}
