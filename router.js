/**
 * Class contains routs
 *
*/
export default class Router extends HTMLElement {
    constructor() {
        super();

        this.currentRoute = "";
        this.wildcard = "";

        this.allRoutes = {
            "login": {
                view: "<login-view></login-view>",
                name: "Logga in",
                class: "icon-login",
                // hidden: true,
            },
            "favorites": {
                view: "<favorite-stations-view></favorite-stations-view>",
                name: "Favoriter",
                class: "icon-favorite",
                // hidden: true,
            },
            "map": {
                view: "<map-view station=$wildcard></map-view>",
                name: "Karta",
                class: "icon-map",
                // hidden: true
            },
            "": {
                view: "<traffic-info-view></traffic-info-view>",
                name: "Tågförseningar",
                class: "icon-traffic",
                // hidden: true,
            },

        };
    }

    get routes() {
        return this.allRoutes;
    }

    // connect component
    connectedCallback() {
        window.addEventListener('hashchange', () => {
            this.resolveRoute();
        });

        this.resolveRoute();
    }

    resolveRoute() {
        let cleanHash = location.hash.replace("#", "");

        this.wildcard = "";

        if (cleanHash.indexOf("/") > -1) {
            let splittedHash = cleanHash.split("/");

            cleanHash = splittedHash[0];
            this.wildcard = splittedHash[1];
        }

        this.currentRoute = cleanHash;

        this.render();
    }

    render() {
        let html = `<not-found></not-found>`;

        if (this.routes[this.currentRoute]) {
            html = this.routes[this.currentRoute].view;

            if (this.wildcard) {
                html = html.replace("$wildcard", this.wildcard);
            }
        }

        this.innerHTML = html;
    }
}
