export default class FavoriteStation extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="error-message">
                <h1>Oops! Something went wrong</h1>
                <p>Sorry, we are unable to load the data at the moment. Please try again later.</p>
            </div>
        `;
    }
}
