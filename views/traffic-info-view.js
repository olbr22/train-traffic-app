export default class TrafficInfoView extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="search-container">
        <search-component></search-component>
        </div>
            <train-list></train-list>
        `;
    }
}
