export default class ErrorHandler extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="error-message">
                <h1>Oops! Something went wrong</h1>
                <p>Sorry, we are unable to load the data at the moment. Please try again later.</p>
                <p>Sorry, we are unable to load the data at the moment. Please try again later.</p>
            </div>
        `;
    }
}
