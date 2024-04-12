import userData from "../models/user-data.js";
import authorization from "../models/authorization.js";

export default class FavoriteStationAdder extends HTMLElement {
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
        this.addIcon = document.createElement("div");
        this.addIcon.classList.add("add-icon");
        this.addIcon.classList.add("icon");
        this.addIcon.style.boxSizing = "border-box";
        this.addIcon.style.backgroundSize = "cover";
        this.addIcon.style.backgroundPosition = "center";
        this.addIcon.style.backgroundRepeat = "no-repeat";
        this.addIcon.style.width = "16px";
        this.addIcon.style.height = "16px";
        this.addIcon.style.backgroundImage = "url(./images/add.svg)";

        this.addIcon.dataset.artefactId = "null"; // Init a dataset to store the artefact ID

        this.addIcon.addEventListener("click", async (event) => {
            const dataID = event.target.dataset.artefactId;

            if (!authorization.token) {
                alert("You need to be logged in to add a station to your favorites.");
                return;
            }

            // If the station is not already removed
            if (!event.target.classList.contains("remove")) {
                this.addIcon.style.backgroundImage = "url(./images/remove.svg)";
                const from = this.station.From;
                const longitude = this.station.GeoLocation[0];
                const latitude = this.station.GeoLocation[1];
                const station = {station: from, lon: longitude, lat: latitude};
                const result = await userData.add(station);
                const artefactID = result.id;

                if (dataID === "null") { // check if the dataset is empty
                    event.target.dataset.artefactId = artefactID;
                }
                alert("The station has been added to your favorites.");
            } else {
                await userData.remove(dataID);
                event.target.dataset.artefactId = "null";
                alert("The station has been deleted from your favorites.");
                this.addIcon.style.backgroundImage = "url(./images/add.svg)";
            }
            event.target.classList.toggle("remove");
        });
        this.appendChild(this.addIcon);
    }
}
