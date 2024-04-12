export default class SearchComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="search-component">
                <input type="text" id="search-input" placeholder="Sök tågstation">
            </div>
        `;

        // Get reference to the search input
        this.searchInput = this.querySelector("#search-input");
        // Add event listener for search input
        this.searchInput.addEventListener('input', () => this.handleSearch());
        // Add a cancel button
        this.cancelButton = document.createElement("span");
        this.cancelButton.classList.add("cancel-button");
        this.cancelButton.innerHTML = '&#10005;'; // Add cancel symbol (X)

        // Add event listener for focus and blur
        this.searchInput.addEventListener('focus', () => {
            // Show §cancel button when input is focused
            this.searchInput.parentElement.appendChild(this.cancelButton);
            this.cancelButton.style.display = "inline-block";
        });

        // Handle cancel button click
        this.cancelButton.addEventListener('click', () => {
            // Clear search input and dispatch search event
            this.searchInput.value = "";
            this.handleSearch();
            // Remove cancel button when input loses focus
            this.cancelButton.style.display = "none";
            this.cancelButton.parentElement.removeChild(this.cancelButton);
        });
    }

    handleSearch() {
        const searchQuery = this.searchInput.value;
        // Dispatch custom event with search query

        document.dispatchEvent(new CustomEvent('search', { detail: searchQuery }));
    }
}
