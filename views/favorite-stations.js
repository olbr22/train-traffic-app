import authorization from "../models/authorization.js";

export default class FavoriteStationsView extends HTMLElement {
    // connect component
    connectedCallback() {
        if (!authorization.token) {
            this.innerHTML = `<h1>Logga in för att se dina favoritstationer</h1>`;
            return;
        }
        this.innerHTML = `<favorite-station-list></favorite-station-list>`;
    }
}
