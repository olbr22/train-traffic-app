import userData from "../models/user-data.js";

export default class FavoriteStationRemover extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ["station"];
    }

    get station() {
        return JSON.parse(this.getAttribute("station"));
    }

    // Adds heart button to save station to favorites
    connectedCallback() {
        this.removeIcon = document.createElement("span");
        this.removeIcon.classList.add("remove-icon");
        // Init a dataset to store the artefact ID
        this.removeIcon.dataset.artefactId = this.station.id;
        this.removeIcon.addEventListener("click", async (event) => {
            const objectID = event.target.dataset.artefactId;
            const favoriteStation = this.previousElementSibling;
            const favoriteStationContatiner = favoriteStation.parentElement;

            await userData.remove(objectID);
            // console.log(await userData.get());

            // Remove the favorite-station element
            event.target.remove();
            favoriteStationContatiner.remove();

            alert("The station has been deleted from your favorites.");
        });

        this.appendChild(this.removeIcon);
    }
}
