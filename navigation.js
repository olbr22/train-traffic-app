import Router from "./router.js";

export default class Navigation extends HTMLElement {
    constructor() {
        super();

        this.router = new Router();
    }

    // connect component
    connectedCallback() {
        const routes = this.router.routes;

        console.log("routes", this.router.routes);

        let navigationLinks = "";

        for (let path in routes) {
            if (routes[path].hidden) {
                continue;
            }
            navigationLinks += `
            <a href='#${path}' class="nav-link">
                <span class="nav-icon ${routes[path].class}"></span>
                <span class="nav-link-name">${routes[path].name}</span>
            </a>`;
        }

        this.innerHTML = `<nav class="bottom-nav">${navigationLinks}</nav>`;

        let links = document.querySelectorAll(".bottom-nav .nav-link");

        for (let i = 0; i < links.length; i++) {
            let link = links[i];

            link.addEventListener("click", (event) => {
                event.preventDefault();

                links.forEach((link) => {
                    link.firstElementChild.classList.remove("active", "orange-filter");
                });

                link.firstElementChild.classList.add("active", "orange-filter");

                setTimeout(() => {
                    location.hash = link.hash.replace("#", "");
                }, 500);
            });
        }
    }
}
