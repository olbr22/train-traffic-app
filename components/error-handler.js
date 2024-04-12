export default class FavoriteStation extends HTMLElement {
    static get observedAttributes() {
        return ["station"];
    }

    get station() {
        return JSON.parse(this.getAttribute("station"));
    }

    get favoriteStation() {
        const artefact = JSON.parse(this.station.artefact);

        return artefact.station;
    }


    connectedCallback() {
        const longitude = JSON.parse(this.station.artefact).lon;
        const latitude = JSON.parse(this.station.artefact).lat;

        this.innerHTML = `
        <div class="favorite-station">
            <a href='#map/${longitude}&${latitude}'>
                <span class="station-icon"></span>
                <span class="station-name">${this.favoriteStation}</span>
            </a>
        </div>
`;
    }
}
